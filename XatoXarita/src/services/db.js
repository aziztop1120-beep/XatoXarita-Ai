import { supabase, isSupabase } from '../lib/supabase.js';

// Bitta interfeys, ikki rejim: Supabase (haqiqiy) yoki localStorage (DEMO).
const ls = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
};
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));
const emit = () => window.dispatchEvent(new Event('xx-auth'));

async function sha(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`xx:${s}`));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const DEFAULT_PROFILE = { name: '', grade: 7, language: 'uz', goal: 'bsb', role: 'student' };
const toUser = (u) => (u ? { id: u.id, email: u.email } : null);

export const auth = {
  async getUser() {
    if (isSupabase) {
      const { data } = await supabase.auth.getSession();
      return toUser(data.session?.user);
    }
    const id = ls.get('xx_session', null);
    return toUser(ls.get('xx_users', []).find((u) => u.id === id));
  },

  onChange(cb) {
    if (isSupabase) {
      const { data } = supabase.auth.onAuthStateChange((_e, session) => cb(toUser(session?.user)));
      return () => data.subscription.unsubscribe();
    }
    const h = () => auth.getUser().then(cb);
    window.addEventListener('xx-auth', h);
    return () => window.removeEventListener('xx-auth', h);
  },

  async signUp({ name, email, password, language }) {
    if (isSupabase) {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { name, language }, emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      return { needsConfirm: !data.session };
    }
    const users = ls.get('xx_users', []);
    if (users.some((u) => u.email === email.toLowerCase())) throw new Error('User already registered');
    const user = { id: uid(), email: email.toLowerCase(), hash: await sha(password), profile: { ...DEFAULT_PROFILE, name, language } };
    ls.set('xx_users', [...users, user]);
    ls.set('xx_session', user.id);
    emit();
    return { needsConfirm: false };
  },

  async signIn({ email, password }) {
    if (isSupabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return;
    }
    const user = ls.get('xx_users', []).find((u) => u.email === email.toLowerCase());
    if (!user || user.hash !== (await sha(password))) throw new Error('Invalid login credentials');
    ls.set('xx_session', user.id);
    emit();
  },

  async signOut() {
    if (isSupabase) { await supabase.auth.signOut(); return; }
    localStorage.removeItem('xx_session');
    emit();
  },

  async resetPassword(email) {
    if (!isSupabase) throw new Error('demo_reset');
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/update-password` });
    if (error) throw error;
  },

  async updatePassword(password) {
    if (isSupabase) {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      return;
    }
    const id = ls.get('xx_session', null);
    const hash = await sha(password);
    ls.set('xx_users', ls.get('xx_users', []).map((u) => (u.id === id ? { ...u, hash } : u)));
  },
};

export const db = {
  async getProfile(user) {
    if (isSupabase) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (error) throw error;
      return { ...DEFAULT_PROFILE, ...(data || {}) };
    }
    const u = ls.get('xx_users', []).find((x) => x.id === user.id);
    return { ...DEFAULT_PROFILE, ...(u?.profile || {}) };
  },

  async updateProfile(user, patch) {
    if (isSupabase) {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...patch, updated_at: new Date().toISOString() })
        .select().single();
      if (error) throw error;
      return { ...DEFAULT_PROFILE, ...data };
    }
    const users = ls.get('xx_users', []);
    let next = null;
    ls.set('xx_users', users.map((u) => {
      if (u.id !== user.id) return u;
      next = { ...u.profile, ...patch };
      return { ...u, profile: next };
    }));
    return { ...DEFAULT_PROFILE, ...next };
  },

  async saveAttempt(user, attempt, mistakes) {
    if (isSupabase) {
      const { data, error } = await supabase.from('attempts')
        .insert({ user_id: user.id, ...attempt }).select().single();
      if (error) throw error;
      if (mistakes.length) {
        const { error: e2 } = await supabase.from('mistakes')
          .insert(mistakes.map((m) => ({ ...m, user_id: user.id, attempt_id: data.id })));
        if (e2) throw e2;
      }
      return data;
    }
    const now = new Date().toISOString();
    const row = { id: uid(), created_at: now, ...attempt };
    ls.set(`xx_attempts_${user.id}`, [row, ...ls.get(`xx_attempts_${user.id}`, [])]);
    ls.set(`xx_mistakes_${user.id}`, [
      ...mistakes.map((m) => ({ id: uid(), attempt_id: row.id, created_at: now, ...m })),
      ...ls.get(`xx_mistakes_${user.id}`, []),
    ]);
    return row;
  },

  async listAttempts(user) {
    if (isSupabase) {
      const { data, error } = await supabase.from('attempts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
    return ls.get(`xx_attempts_${user.id}`, []);
  },

  async listMistakes(user) {
    if (isSupabase) {
      const { data, error } = await supabase.from('mistakes').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
    return ls.get(`xx_mistakes_${user.id}`, []);
  },
};

// Ustoz paneli: barcha o‘quvchilar, testlar va xatolar (Supabase'da faqat role='teacher' ko‘ra oladi — RLS).
async function fetchAll(table, columns) {
  const out = [];
  const size = 1000;
  for (let from = 0; ; from += size) {
    const { data, error } = await supabase.from(table).select(columns)
      .order('created_at', { ascending: false }).range(from, from + size - 1);
    if (error) throw error;
    out.push(...data);
    if (data.length < size) break;
  }
  return out;
}

export const adminApi = {
  async loadAll() {
    if (isSupabase) {
      const [profiles, attempts, mistakes] = await Promise.all([
        fetchAll('profiles', 'id,name,email,grade,role,created_at'),
        fetchAll('attempts', 'id,user_id,subject,topic,grade,score,total,created_at'),
        fetchAll('mistakes', 'id,user_id,attempt_id,subject,topic,question,options,user_answer,correct_answer,explanation,reason,created_at'),
      ]);
      return { profiles, attempts, mistakes };
    }
    const users = ls.get('xx_users', []);
    return {
      profiles: users.map((u) => ({ id: u.id, email: u.email, ...DEFAULT_PROFILE, ...(u.profile || {}) })),
      attempts: users.flatMap((u) => ls.get(`xx_attempts_${u.id}`, []).map((a) => ({ ...a, user_id: u.id }))),
      mistakes: users.flatMap((u) => ls.get(`xx_mistakes_${u.id}`, []).map((m) => ({ ...m, user_id: u.id }))),
    };
  },
};
