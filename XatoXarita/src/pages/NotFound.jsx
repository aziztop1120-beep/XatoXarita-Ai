import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext.jsx';

export default function NotFound() {
  const { t } = useLang();
  return (
    <div className="container page">
      <div className="state-box">
        <h1>404</h1>
        <p>{t('nf_title')}</p>
        <Link className="btn btn-primary" to="/">{t('go_home')}</Link>
      </div>
    </div>
  );
}
