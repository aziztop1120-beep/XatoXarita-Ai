import { AlertCircle, CheckCircle2, Info, Loader2, Inbox } from 'lucide-react'
import { useLang } from '../context/LangContext'
import { hasSupabase } from '../lib/supabase'

export function Loader({ text }) {
  const { t } = useLang()
  return (
    <div className="loader" role="status">
      <Loader2 className="loader__icon" size={28} />
      <span>{text || t('common_loading')}</span>
    </div>
  )
}

export function Alert({ type = 'error', children }) {
  if (!children) return null
  const Icon = type === 'success' ? CheckCircle2 : type === 'info' ? Info : AlertCircle
  return (
    <div className={`alert alert--${type}`} role="alert">
      <Icon size={18} />
      <span>{children}</span>
    </div>
  )
}

export function ErrorState({ onRetry }) {
  const { t } = useLang()
  return (
    <div className="state">
      <AlertCircle size={36} className="state__icon state__icon--error" />
      <p>{t('common_error')}</p>
      {onRetry && (
        <button className="btn btn--outline" onClick={onRetry}>
          {t('common_retry')}
        </button>
      )}
    </div>
  )
}

export function EmptyState({ icon: Icon = Inbox, text, action }) {
  return (
    <div className="state">
      <Icon size={36} className="state__icon" />
      <p>{text}</p>
      {action}
    </div>
  )
}

export function DemoBanner({ ai = false }) {
  const { t } = useLang()
  if (!ai && hasSupabase) return null
  return (
    <div className="demo-banner">
      <Info size={16} />
      <span>{ai ? t('common_demo_ai') : t('common_demo')}</span>
    </div>
  )
}

export function Field({ label, error, id, ...props }) {
  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
      {error && <small className="field__error">{error}</small>}
    </div>
  )
}

export function ProgressBar({ value, tone }) {
  const auto = value >= 80 ? 'good' : value >= 50 ? 'mid' : 'bad'
  return (
    <div className="progress">
      <div className={`progress__bar progress__bar--${tone || auto}`} style={{ width: `${value}%` }} />
    </div>
  )
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}
