import { TriangleAlert } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';

export default function ErrorBox({ message, onRetry }) {
  const { t } = useLang();
  return (
    <div className="state-box state-error" role="alert">
      <TriangleAlert size={28} />
      <p>{message || t('err_load')}</p>
      {onRetry && <button className="btn btn-outline btn-sm" onClick={onRetry}>{t('retry')}</button>}
    </div>
  );
}
