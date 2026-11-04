import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { KeyRound } from 'lucide-react'
import { useAuth, authErrorKey } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { Alert, Field } from '../components/Ui'
import { hasSupabase } from '../lib/supabase'
import { isEmail } from '../lib/helpers'

export default function ResetPassword() {
  const { t } = useLang()
  const { resetPassword } = useAuth()
  const [params] = useSearchParams()
  const nav = useNavigate()
  const [f, setF] = useState({ email: params.get('email') || '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [server, setServer] = useState('')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = async (ev) => {
    ev.preventDefault()
    setServer('')
    const e = {}
    if (!hasSupabase && !isEmail(f.email)) e.email = t('err_email')
    if (!f.password) e.password = t('err_required')
    else if (f.password.length < 6) e.password = t('err_pass_short')
    if (f.confirm !== f.password) e.confirm = t('err_pass_match')
    setErrors(e)
    if (Object.keys(e).length) return
    setBusy(true)
    try {
      await resetPassword({ email: f.email.trim(), password: f.password })
      setDone(true)
      setTimeout(() => nav('/login'), 1500)
    } catch (err) {
      setServer(t(authErrorKey(err)))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth">
      <form className="auth__card card" onSubmit={submit} noValidate>
        <h1>{t('auth_reset_title')}</h1>
        <Alert>{server}</Alert>
        <Alert type="success">{done ? t('auth_reset_ok') : ''}</Alert>
        {!hasSupabase && <Field id="email" type="email" label={t('auth_email')} value={f.email} onChange={set('email')} error={errors.email} />}
        <Field id="password" type="password" label={t('auth_new_password')} value={f.password} onChange={set('password')} error={errors.password} autoComplete="new-password" />
        <Field id="confirm" type="password" label={t('auth_confirm')} value={f.confirm} onChange={set('confirm')} error={errors.confirm} autoComplete="new-password" />
        <button className="btn btn--primary btn--block" disabled={busy || done}>
          <KeyRound size={18} /> {t('auth_reset_btn')}
        </button>
        <p className="auth__alt"><Link to="/login">{t('common_back')}</Link></p>
      </form>
    </div>
  )
}
