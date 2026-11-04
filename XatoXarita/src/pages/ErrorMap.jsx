import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { db } from '../services/db.js';
import { useLoad } from '../lib/useLoad.js';
import { weakTopics, topicName, subjectName } from '../lib/stats.js';
import Loader from '../components/Loader.jsx';
import ErrorBox from '../components/ErrorBox.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function ErrorMap() {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const [open, setOpen] = useState(null);
  const { loading, error, data, reload } = useLoad(() => db.listMistakes(user), [user.id]);

  if (loading) return <div className="container page"><Loader /></div>;
  if (error) return <div className="container page"><ErrorBox onRetry={reload} /></div>;

  const weak = weakTopics(data);
  const max = weak[0]?.count || 1;

  return (
    <div className="container page">
      <div className="page-head"><div><h1>{t('m_title')}</h1><p className="muted">{t('m_sub')}</p></div></div>
      {weak.length === 0 ? (
        <EmptyState title={t('m_empty_t')} text={t('m_empty_d')}
          action={<Link className="btn btn-primary" to="/tests">{t('quick_test')}</Link>} />
      ) : (
        <div className="stack">
          {weak.map((w) => {
            const key = `${w.subject}|${w.topic}`;
            const isOpen = open === key;
            return (
              <article key={key} className="card map-item">
                <div className="row-between wrap">
                  <div>
                    <h3>{topicName(w.topic, lang)}</h3>
                    <span className="muted">{subjectName(w.subject, lang)}</span>
                  </div>
                  <span className="chip chip-bad">{t('m_count', { n: w.count })}</span>
                </div>
                <div className="heat"><span style={{ width: `${(w.count / max) * 100}%` }} /></div>
                <div className="map-actions">
                  <Link className="btn btn-primary btn-sm" to={`/topics?s=${w.subject}&t=${w.topic}`}>{t('m_practice')}</Link>
                  <button className="btn btn-ghost btn-sm" onClick={() => setOpen(isOpen ? null : key)}>
                    {isOpen ? t('m_hide') : t('m_details')} <ChevronDown size={16} className={isOpen ? 'rot' : ''} />
                  </button>
                </div>
                {isOpen && (
                  <div className="map-details">
                    {w.items.map((m) => (
                      <div key={m.id} className="mistake-mini">
                        <h4>{m.question}</h4>
                        <p className="row good"><CheckCircle2 size={16} /> <span><b>{t('r_correct')}:</b> {m.options?.[m.correct_answer]}</span></p>
                        {m.explanation && <p><b>{t('r_expl')}:</b> {m.explanation}</p>}
                        {m.reason && <p><b>{t('r_reason')}:</b> {m.reason}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
