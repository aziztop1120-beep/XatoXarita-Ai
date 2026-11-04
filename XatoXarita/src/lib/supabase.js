import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase sozlanmagan bo‘lsa — ilova brauzer xotirasida DEMO rejimda ishlaydi.
export const isSupabase = Boolean(url && key && !url.includes('your-project'));
export const supabase = isSupabase ? createClient(url, key) : null;
export const aiEnabled = isSupabase && import.meta.env.VITE_AI_ENABLED === 'true';
