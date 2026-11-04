import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { auth } from '../services/db.js';
import { errMsg } from '../lib/validate.js';
import Field from '../components/Field.jsx';

export default function UpdatePassword() {
  const { t } = useLang();
  const [v, setV] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setFormError('');
    const errs = {};
    if (v.password.length < 8) errs.password = t('e_pass');
    if (v.confirm !== v.password) errs.confirm = t('e_match');
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await auth.updatePassword(v.password);
      setDone(true);
    } catch (err) {
      setFormError(errMsg(err, t));
    } finally { setBusy(false); }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={submit} noValidate>
        <h1>{t('upd_title')}</h1>
        <Field id="password" type="password" label={t('f_password')} icon={Lock} value={v.password} onChange={(e) => setV({ ...v, password: e.target.value })} error={errors.password} autoComplete="new-password" />
        <Field id="confirm" type="password" label={t('f_confirm')} icon={Lock} value={v.confirm} onChange={(e) => setV({ ...v, confirm: e.target.value })} error={errors.confirm} autoComplete="new-password" />
        {formError && <p className="form-error" role="alert">{formError}</p>}
        {done && <p className="form-info" role="status">{t('upd_done')} <Link to="/dashboard">{t('nav_dashboard')}</Link></p>}
        <button className="btn btn-primary btn-block" disabled={busy || done}>{busy ? t('loading') : t('upd_btn')}</button>
      </form>
    </div>
  );
}
