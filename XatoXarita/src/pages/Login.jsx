import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { auth } from '../services/db.js';
import { validateLogin, errMsg } from '../lib/validate.js';
import Field from '../components/Field.jsx';

export default function Login() {
  const { t } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [v, setV] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={location.state?.from || '/dashboard'} replace />;
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setFormError('');
    const errs = validateLogin(v);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await auth.signIn({ email: v.email.trim(), password: v.password });
      navigate(location.state?.from || '/dashboard');
    } catch (err) {
      setFormError(errMsg(err, t));
    } finally { setBusy(false); }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={submit} noValidate>
        <h1>{t('login_title')}</h1>
        <p className="muted">{t('login_sub')}</p>
        <Field id="email" type="email" label={t('f_email')} icon={Mail} value={v.email} onChange={set('email')} error={errors.email && t(errors.email)} autoComplete="email" />
        <Field id="password" type="password" label={t('f_password')} icon={Lock} value={v.password} onChange={set('password')} error={errors.password && t(errors.password)} autoComplete="current-password" />
        <Link className="forgot-link" to="/forgot-password">{t('forgot')}</Link>
        {formError && <p className="form-error" role="alert">{formError}</p>}
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? t('loading') : t('login')}</button>
        <p className="auth-switch">{t('no_acc')} <Link to="/register">{t('register')}</Link></p>
      </form>
    </div>
  );
}
