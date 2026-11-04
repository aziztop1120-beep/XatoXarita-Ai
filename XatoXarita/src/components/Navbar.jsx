import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Sun, Moon } from 'lucide-react';
import { useLang, LANGS } from '../i18n/LangContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { auth } from '../services/db.js';
import Logo from './Logo.jsx';

export default function Navbar() {
  const { t, lang, setLang } = useLang();
  const { user, profile } = useAuth();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const close = () => setOpen(false);

  const links = user
    ? [['/dashboard', 'nav_dashboard'], ['/tests', 'nav_tests'], ['/error-map', 'nav_map'], ['/topics', 'nav_topics'], ['/results', 'nav_results'], ['/profile', 'nav_profile'], ...(profile?.role === 'teacher' ? [['/admin', 'nav_admin']] : [])]
    : [['/', 'nav_home']];

  async function logout() {
    await auth.signOut();
    close();
    navigate('/');
  }

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="brand" onClick={close}><Logo /></Link>
        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map(([to, key]) => (
            <NavLink key={to} to={to} onClick={close} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>{t(key)}</NavLink>
          ))}
          <div className="nav-actions-mobile">
            {user ? (
              <button className="btn btn-ghost" onClick={logout}><LogOut size={16} /> {t('logout')}</button>
            ) : (
              <>
                <Link className="btn btn-ghost" to="/login" onClick={close}>{t('login')}</Link>
                <Link className="btn btn-primary" to="/register" onClick={close}>{t('register')}</Link>
              </>
            )}
          </div>
        </nav>
        <div className="nav-right">
          <div className="lang-switch" role="group" aria-label="Language">
            {LANGS.map((l) => (
              <button key={l} className={l === lang ? 'on' : ''} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
          <button className="theme-toggle" onClick={toggle} aria-label={t('theme_toggle')} title={t('theme_toggle')}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="nav-actions">
            {user ? (
              <button className="btn btn-ghost btn-sm" onClick={logout}><LogOut size={16} /> {t('logout')}</button>
            ) : (
              <>
                <Link className="btn btn-ghost btn-sm" to="/login">{t('login')}</Link>
                <Link className="btn btn-primary btn-sm" to="/register">{t('register')}</Link>
              </>
            )}
          </div>
          <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
        </div>
      </div>
    </header>
  );
}
