import { useLang } from '../i18n/LangContext.jsx';
import Logo from './Logo.jsx';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Logo />
        <span>© {new Date().getFullYear()} XatoXarita AI. {t('footer')}</span>
      </div>
    </footer>
  );
}
