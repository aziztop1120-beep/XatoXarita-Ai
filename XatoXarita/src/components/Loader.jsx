import { Loader2 } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';

export default function Loader({ full = false, text }) {
  const { t } = useLang();
  return (
    <div className={`loader ${full ? 'loader-full' : ''}`} role="status">
      <Loader2 className="spin" size={28} />
      <span>{text || t('loading')}</span>
    </div>
  );
}
