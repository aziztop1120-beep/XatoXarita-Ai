import { Link } from 'react-router-dom';
import { ClipboardList, Map, ClipboardCheck, Percent, XCircle, Target } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { db } from '../services/db.js';
import { useLoad } from '../lib/useLoad.js';
import { pct, weakTopics, topicName, subjectName } from '../lib/stats.js';
import Loader from '../components/Loader.jsx';
import ErrorBox from '../components/ErrorBox.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Dashboard() {
  const { t, lang } = useLang();
  const { user, profile } = useAuth();
  const { loading, error, data, reload } = useLoad(
    async () => { const [attempts, mistakes] = await Promise.all([db.listAttempts(user), db.listMistakes(user)]); return { attempts, mistakes }; },
    [user.id]
  );

  const name = profile.name || user.email.split('@')[0];
  if (loading) return <div className="container page"><Loader /></div>;
  if (error) return <div className="container page"><ErrorBox onRetry={reload} /></div>;

  const { attempts, mistakes } = data;
  const weak = weakTopics(mistakes);
  const avg = attempts.length ? Math.round(attempts.reduce((s, a) => s + pct(a), 0) / attempts.length) : 0;
  const stats = [
    [ClipboardCheck, t('st_tests'), attempts.length],
    [Percent, t('st_avg'), `${avg}%`],
    [XCircle, t('st_mistakes'), mistakes.length],
    [Target, t('st_weak'), weak.length],
  ];

  return (
    <div className="container page">
      <div className="page-head">
        <div><h1>{t('hi', { name })}</h1><p className="muted">{t('dash_sub')}</p></div>
        <div className="head-actions">
          <Link to="/tests" className="btn btn-primary"><ClipboardList size={18} /> {t('quick_test')}</Link>
          <Link to="/error-map" className="btn btn-outline"><Map size={18} /> {t('quick_map')}</Link>
        </div>
      </div>

      <div className="grid grid-4">
        {stats.map(([Icon, label, value]) => (
          <div key={label} className="card stat">
            <span className="icon-box"><Icon size={20} /></span>
            <strong>{value}</strong><span className="muted">{label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-2 gap-top">
        <section className="card">
          <h3>{t('weak_top')}</h3>
          {weak.length === 0 ? <EmptyState title={t('m_empty_t')} text={t('m_empty_d')} /> : (
            <ul className="list">
              {weak.slice(0, 3).map((w) => (
                <li key={`${w.subject}${w.topic}`}>
                  <div><b>{topicName(w.topic, lang)}</b><span className="muted"> · {subjectName(w.subject, lang)}</span></div>
                  <span className="chip chip-bad">{t('m_count', { n: w.count })}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="card">
          <div className="row-between"><h3>{t('last_att')}</h3><Link to="/results">{t('view_all')}</Link></div>
          {attempts.length === 0 ? <EmptyState title={t('rs_empty_t')} text={t('rs_empty_d')} /> : (
            <ul className="list">
              {attempts.slice(0, 4).map((a) => (
                <li key={a.id}>
                  <div><b>{subjectName(a.subject, lang)}</b><span className="muted"> · {topicName(a.topic, lang, t('all_topics'))}</span></div>
                  <span className="chip">{a.score}/{a.total}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
