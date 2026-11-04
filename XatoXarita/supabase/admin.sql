-- Ustoz paneli uchun migratsiya. schema.sql dan KEYIN, SQL Editor'da to‘liq ishga tushiring.

alter table public.profiles add column if not exists role text not null default 'student' check (role in ('student', 'teacher'));
alter table public.profiles add column if not exists email text not null default '';

-- Eski foydalanuvchilarning emailini to‘ldirish
update public.profiles p set email = u.email from auth.users u where u.id = p.id and p.email = '';

-- Yangi foydalanuvchi profilida email ham saqlansin
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email, language)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.email, ''),
    case when new.raw_user_meta_data->>'language' in ('uz','ru','en')
         then new.raw_user_meta_data->>'language' else 'uz' end
  )
  on conflict (id) do nothing;
  return new;
end $$;

-- Foydalanuvchi o‘zini ustoz qilib qo‘ya olmasligi uchun: role va email faqat SQL Editor orqali o‘zgaradi
create or replace function public.protect_profile_role()
returns trigger language plpgsql as $$
begin
  if auth.uid() is not null then
    new.role := old.role;
    new.email := old.email;
  end if;
  return new;
end $$;

drop trigger if exists protect_role on public.profiles;
create trigger protect_role before update on public.profiles
  for each row execute function public.protect_profile_role();

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert
  with check (auth.uid() = id and role = 'student');

-- Ustozmi? (RLS ni chetlab o‘tish uchun security definer)
create or replace function public.is_teacher()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'teacher');
$$;

drop policy if exists "profiles_select_teacher" on public.profiles;
drop policy if exists "attempts_select_teacher" on public.attempts;
drop policy if exists "mistakes_select_teacher" on public.mistakes;
create policy "profiles_select_teacher" on public.profiles for select using (public.is_teacher());
create policy "attempts_select_teacher" on public.attempts for select using (public.is_teacher());
create policy "mistakes_select_teacher" on public.mistakes for select using (public.is_teacher());

-- Ustoz tayinlash (email ni o‘zgartiring):
-- update public.profiles set role = 'teacher' where email = 'ustoz@example.com';
