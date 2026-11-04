import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import DemoBanner from './DemoBanner.jsx';
import { isSupabase } from '../lib/supabase.js';
import { useLang } from '../i18n/LangContext.jsx';

export default function Layout() {
  const { t } = useLang();
  return (
    <div className="shell">
      {!isSupabase && <DemoBanner>{t('demo_store')}</DemoBanner>}
      <Navbar />
      <main className="main"><Outlet /></main>
      <Footer />
    </div>
  );
}
