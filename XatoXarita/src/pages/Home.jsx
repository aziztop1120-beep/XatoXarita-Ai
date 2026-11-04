import { Link } from 'react-router-dom';
import { ClipboardList, Map, Brain, Dumbbell, BarChart3, Languages, ArrowRight } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const FEATURES = [
  [ClipboardList, 'f1'], [Map, 'f2'], [Brain, 'f3'], [Dumbbell, 'f4'], [BarChart3, 'f5'], [Languages, 'f6'],
];

export default function Home() {
  const { t } = useLang();
  const { user } = useAuth();
  const cta = user ? '/dashboard' : '/register';

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <span className="badge">{t('hero_badge')}</span>
          <h1>{t('hero_title')}</h1>
          <p>{t('hero_sub')}</p>
          <div className="hero-actions">
            <Link to={cta} className="btn btn-primary btn-lg">{t('start')} <ArrowRight size={18} /></Link>
            {!user && <Link to="/login" className="btn btn-outline btn-lg">{t('login')}</Link>}
          </div>
        </div>
      </section>

      <section className="container section">
        <h2 className="section-heading">{t('feat_title')}</h2>
        <div className="grid grid-3">
          {FEATURES.map(([Icon, k]) => (
            <article key={k} className="card feature">
              <span className="icon-box"><Icon size={22} /></span>
              <h3>{t(`${k}_t`)}</h3>
              <p>{t(`${k}_d`)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <h2 className="section-heading">{t('how_title')}</h2>
        <div className="grid grid-3">
          {['s1', 's2', 's3'].map((k, i) => (
            <article key={k} className="card step">
              <span className="step-num">{i + 1}</span>
              <h3>{t(`${k}_t`)}</h3>
              <p>{t(`${k}_d`)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="cta">
          <h2>{t('cta_title')}</h2>
          <Link to={cta} className="btn btn-light btn-lg">{t('start')} <ArrowRight size={18} /></Link>
        </div>
      </section>
    </>
  );
}
