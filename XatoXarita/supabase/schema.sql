-- XatoXarita AI — Supabase sxemasi. SQL Editor'da to‘liq ishga tushiring.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  grade int not null default 7 check (grade between 5 and 11),
  language text not null default 'uz' check (language in ('uz','ru','en')),
  goal text not null default 'bsb',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  topic text not null,
  grade int,
  score int not null check (score >= 0),
  total int not null check (total > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.mistakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  attempt_id uuid references public.attempts(id) on delete cascade,
  question_id text,
  subject text not null,
  topic text not null,
  question text not null,
  options jsonb not null default '[]',
  user_answer int,
  correct_answer int,
  explanation text,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists attempts_user_idx on public.attempts (user_id, created_at desc);
create index if not exists mistakes_user_idx on public.mistakes (user_id, created_at desc);

-- Row Level Security: har bir foydalanuvchi faqat o‘z ma’lumotini ko‘radi
alter table public.profiles enable row level security;
alter table public.attempts enable row level security;
alter table public.mistakes enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "attempts_select_own" on public.attempts for select using (auth.uid() = user_id);
create policy "attempts_insert_own" on public.attempts for insert with check (auth.uid() = user_id);
create policy "attempts_delete_own" on public.attempts for delete using (auth.uid() = user_id);

create policy "mistakes_select_own" on public.mistakes for select using (auth.uid() = user_id);
create policy "mistakes_insert_own" on public.mistakes for insert with check (auth.uid() = user_id);
create policy "mistakes_delete_own" on public.mistakes for delete using (auth.uid() = user_id);

-- Ro‘yxatdan o‘tganda profil avtomatik yaratiladi
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, language)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    case when new.raw_user_meta_data->>'language' in ('uz','ru','en')
         then new.raw_user_meta_data->>'language' else 'uz' end
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
