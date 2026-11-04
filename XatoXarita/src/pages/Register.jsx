import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { auth } from '../services/db.js';
import { validateRegister, errMsg } from '../lib/validate.js';
import Field from '../components/Field.jsx';

export default function Register() {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [v, setV] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setFormError(''); setInfo('');
    const errs = validateRegister(v);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      const r = await auth.signUp({ name: v.name.trim(), email: v.email.trim(), password: v.password, language: lang });
      if (r.needsConfirm) setInfo(t('info_confirm')); else navigate('/dashboard');
    } catch (err) {
      setFormError(errMsg(err, t));
    } finally { setBusy(false); }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={submit} noValidate>
        <h1>{t('reg_title')}</h1>
        <p className="muted">{t('reg_sub')}</p>
        <Field id="name" label={t('f_name')} icon={User} value={v.name} onChange={set('name')} error={errors.name && t(errors.name)} autoComplete="name" />
        <Field id="email" type="email" label={t('f_email')} icon={Mail} value={v.email} onChange={set('email')} error={errors.email && t(errors.email)} autoComplete="email" />
        <Field id="password" type="password" label={t('f_password')} icon={Lock} value={v.password} onChange={set('password')} error={errors.password && t(errors.password)} autoComplete="new-password" />
        <Field id="confirm" type="password" label={t('f_confirm')} icon={Lock} value={v.confirm} onChange={set('confirm')} error={errors.confirm && t(errors.confirm)} autoComplete="new-password" />
        {formError && <p className="form-error" role="alert">{formError}</p>}
        {info && <p className="form-info" role="status">{info}</p>}
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? t('loading') : t('register')}</button>
        <p className="auth-switch">{t('have_acc')} <Link to="/login">{t('login')}</Link></p>
      </form>
    </div>
  );
}
