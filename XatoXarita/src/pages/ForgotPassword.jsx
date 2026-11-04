import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { auth } from '../services/db.js';
import { isEmail, errMsg } from '../lib/validate.js';
import Field from '../components/Field.jsx';

export default function ForgotPassword() {
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setFormError(''); setInfo('');
    if (!isEmail(email)) { setError(t('e_email')); return; }
    setError('');
    setBusy(true);
    try {
      await auth.resetPassword(email.trim());
      setInfo(t('link_sent'));
    } catch (err) {
      setFormError(err.message === 'demo_reset' ? t('demo_reset_note') : errMsg(err, t));
    } finally { setBusy(false); }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={submit} noValidate>
        <h1>{t('forgot_title')}</h1>
        <p className="muted">{t('forgot_sub')}</p>
        <Field id="email" type="email" label={t('f_email')} icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
        {formError && <p className="form-error" role="alert">{formError}</p>}
        {info && <p className="form-info" role="status">{info}</p>}
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? t('loading') : t('send_link')}</button>
        <p className="auth-switch"><Link to="/login">{t('back')}</Link></p>
      </form>
    </div>
  );
}
