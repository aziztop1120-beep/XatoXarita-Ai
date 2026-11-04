import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { auth } from '../services/db.js';
import { isSupabase } from '../lib/supabase.js';
import Field from '../components/Field.jsx';

const GOALS = ['bsb', 'chsb', 'olymp', 'school', 'exam'];

export default function Profile() {
  const { t } = useLang();
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [v, setV] = useState({ name: profile.name, grade: profile.grade, language: profile.language, goal: profile.goal });
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setMsg(''); setError('');
    if (v.name.trim().length < 2) { setError(t('e_name')); return; }
    setBusy(true);
    try {
      await updateProfile({ name: v.name.trim(), grade: Number(v.grade), language: v.language, goal: v.goal });
      setMsg(t('saved'));
    } catch { setError(t('e_generic')); } finally { setBusy(false); }
  }

  // Faqat DEMO rejimda: ustoz kodi orqali ustozlik (Supabase'da role faqat SQL orqali beriladi)
  const [code, setCode] = useState('');
  const [codeMsg, setCodeMsg] = useState('');
  async function becomeTeacher() {
    if (code.trim() !== (import.meta.env.VITE_TEACHER_CODE || 'ustoz2026')) { setCodeMsg(t('ad_code_bad')); return; }
    await updateProfile({ role: 'teacher' });
    setCodeMsg(t('ad_code_ok'));
  }

  async function logout() { await auth.signOut(); navigate('/'); }

  return (
    <div className="container page narrow">
      <div className="page-head"><div><h1>{t('p_title')}</h1><p className="muted">{t('p_sub')}</p></div></div>
      <form className="card form-card" onSubmit={submit} noValidate>
        <Field id="email" label={t('f_email')} value={user.email} disabled readOnly />
        <Field id="name" label={t('f_name')} value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} />
        <Field id="grade" label={t('f_grade')}>
          <select id="grade" value={v.grade} onChange={(e) => setV({ ...v, grade: e.target.value })}>
            {[5, 6, 7, 8, 9, 10, 11].map((g) => <option key={g} value={g}>{t('grade_n', { n: g })}</option>)}
          </select>
        </Field>
        <Field id="language" label={t('f_language')}>
          <select id="language" value={v.language} onChange={(e) => setV({ ...v, language: e.target.value })}>
            <option value="uz">O‘zbekcha</option><option value="ru">Русский</option><option value="en">English</option>
          </select>
        </Field>
        <Field id="goal" label={t('f_goal')}>
          <select id="goal" value={v.goal} onChange={(e) => setV({ ...v, goal: e.target.value })}>
            {GOALS.map((g) => <option key={g} value={g}>{t(`g_${g}`)}</option>)}
          </select>
        </Field>
        {error && <p className="form-error" role="alert">{error}</p>}
        {msg && <p className="form-info" role="status">{msg}</p>}
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? t('loading') : t('save')}</button>
        <button type="button" className="btn btn-outline btn-block" onClick={logout}><LogOut size={16} /> {t('logout')}</button>
      </form>
      {!isSupabase && profile.role !== 'teacher' && (
        <section className="card form-card gap-top">
          <Field id="tcode" label={t('ad_code')} value={code} onChange={(e) => setCode(e.target.value)} />
          {codeMsg && <p className="form-info" role="status">{codeMsg}</p>}
          <button type="button" className="btn btn-outline btn-block" onClick={becomeTeacher}>{t('ad_code_btn')}</button>
        </section>
      )}
    </div>
  );
}
