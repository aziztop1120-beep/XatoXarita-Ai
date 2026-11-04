# XatoXarita AI

O‘quvchining xatolarini topadigan, AI yordamida sodda tushuntiradigan va zaif mavzular bo‘yicha yangi mashqlar beradigan ta’lim platformasi.

**Texnologiyalar:** React + Vite, JavaScript, oddiy CSS (Tailwind yo‘q), React Router, lucide-react, Supabase (Auth + Postgres + RLS + Edge Functions), AI (Edge Function orqali).

## Tez ishga tushirish (DEMO rejim)

```bash
npm install
npm run dev
```

`.env` bo‘lmasa ilova **DEMO rejimda** ishlaydi: ro‘yxatdan o‘tish va natijalar faqat shu brauzerning `localStorage`ida saqlanadi (parol SHA-256 hash qilinadi), AI o‘rniga tayyor namunalar ishlatiladi. Bu holat saytda sariq banner bilan aniq ko‘rsatiladi.

## Haqiqiy rejim (Supabase + AI)

1. [supabase.com](https://supabase.com) da loyiha yarating.
2. **SQL Editor**da `supabase/schema.sql` faylini to‘liq ishga tushiring (jadvallar, RLS siyosatlari, profil triggeri).
3. `.env.example` ni `.env` ga nusxalang va to‘ldiring:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   VITE_AI_ENABLED=true
   ```
4. Authentication → URL Configuration: `Site URL` ga `http://localhost:5173` (deploydan keyin o‘z domeningiz) va Redirect URLs ga `/update-password` manzilini qo‘shing.
5. **AI (kalit frontendda saqlanmaydi):**
   ```bash
   npm i -g supabase
   supabase login
   supabase link --project-ref <PROJECT_REF>
   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
   supabase functions deploy ai-tutor
   ```
   Edge Function `claude-sonnet-4-6` modelini chaqiradi (`supabase/functions/ai-tutor/index.ts` da o‘zgartirish mumkin). Funksiya JWT talab qiladi — faqat tizimga kirgan foydalanuvchilar chaqira oladi.
6. `npm run dev` ni qayta ishga tushiring. AI ishlamasa, ilova avtomatik demo izohlarga o‘tadi va foydalanuvchiga ko‘rsatadi.

## Tuzilma

```
src/
  components/  Navbar, Layout, QuizSession, ResultView, Field, Loader, ErrorBox, EmptyState...
  pages/       Home, Register, Login, ForgotPassword, UpdatePassword, Dashboard,
               Tests, ErrorMap, Topics, Results, Profile, NotFound
  styles/      base.css, layout.css, home.css, auth.css, app.css
  i18n/        translations.js (uz/ru/en), LangContext.jsx
  lib/         supabase.js, questions.js (savollar banki), validate.js, stats.js, useLoad.js
  services/    db.js (Supabase/demo), ai.js (AI chaqiruvlari)
  context/     AuthContext.jsx
supabase/      schema.sql, functions/ai-tutor
```

## Xavfsizlik

- Supabase Auth (parollar serverda hash qilinadi), RLS: har bir foydalanuvchi faqat o‘z qatorlarini ko‘radi/yozadi.
- Maxfiy kalitlar `.env` va Supabase secrets'da; `.env` `.gitignore` da.
- Frontendda faqat `anon` kalit bor (u RLS bilan himoyalangan).

## Eslatmalar

- Savollar banki (`src/lib/questions.js`) o‘zbek tilida; interfeys 3 tilda, AI izohlari va yangi mashqlar tanlangan tilda yaratiladi. Yangi savol/mavzu qo‘shish uchun shu faylni tahrirlang.
- Deploy (Vercel/Netlify): SPA uchun barcha yo‘llarni `index.html` ga yo‘naltiring.
