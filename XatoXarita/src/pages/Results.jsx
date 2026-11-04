import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { db } from '../services/db.js';
import { useLoad } from '../lib/useLoad.js';
import { pct, topicName, subjectName, trend } from '../lib/stats.js';
import Loader from '../components/Loader.jsx';
import ErrorBox from '../components/ErrorBox.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Results() {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const { loading, error, data, reload } = useLoad(() => db.listAttempts(user), [user.id]);

  if (loading) return <div className="container page"><Loader /></div>;
  if (error) return <div className="container page"><ErrorBox onRetry={reload} /></div>;

  const fmt = (d) => new Date(d).toLocaleDateString(lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-GB');
  const best = data.length ? Math.max(...data.map(pct)) : 0;
  const tr = trend(data);
  const chart = data.slice(0, 10).reverse();

  return (
    <div className="container page">
      <div className="page-head"><div><h1>{t('rs_title')}</h1><p className="muted">{t('rs_sub')}</p></div></div>
      {data.length === 0 ? (
        <EmptyState title={t('rs_empty_t')} text={t('rs_empty_d')}
          action={<Link className="btn btn-primary" to="/tests">{t('quick_test')}</Link>} />
      ) : (
        <>
          <div className="grid grid-3">
            <div className="card stat"><strong>{data.length}</strong><span className="muted">{t('rs_total')}</span></div>
            <div className="card stat"><strong>{best}%</strong><span className="muted">{t('rs_best')}</span></div>
            <div className="card stat">
              <strong>{tr === null ? '—' : tr > 0 ? t('rs_up', { n: tr }) : tr < 0 ? t('rs_down', { n: Math.abs(tr) }) : t('rs_flat')}</strong>
              <span className="muted">{t('rs_trend')}</span>
            </div>
          </div>

          <section className="card gap-top">
            <h3>{t('rs_chart')}</h3>
            <div className="bars">
              {chart.map((a) => (
                <div key={a.id} className="bar-col" title={`${pct(a)}%`}>
                  <span className="bar-val">{pct(a)}</span>
                  <div className="bar" style={{ height: `${Math.max(pct(a), 4)}%` }} />
                </div>
              ))}
            </div>
          </section>

          <section className="card gap-top table-wrap">
            <table className="table">
              <thead><tr><th>{t('rs_date')}</th><th>{t('subject')}</th><th>{t('topic')}</th><th>{t('r_title')}</th></tr></thead>
              <tbody>
                {data.map((a) => (
                  <tr key={a.id}>
                    <td>{fmt(a.created_at)}</td>
                    <td>{subjectName(a.subject, lang)}</td>
                    <td>{topicName(a.topic, lang, t('all_topics'))}</td>
                    <td><span className="chip">{a.score}/{a.total} · {pct(a)}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}
