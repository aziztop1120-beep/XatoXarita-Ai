import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { db } from '../services/db.js';
import { generateExercises } from '../services/ai.js';
import { SUBJECTS, TOPICS } from '../lib/questions.js';
import { useLoad } from '../lib/useLoad.js';
import Loader from '../components/Loader.jsx';
import ErrorBox from '../components/ErrorBox.jsx';
import QuizSession from '../components/QuizSession.jsx';
import DemoBanner from '../components/DemoBanner.jsx';

export default function Topics() {
  const { t, lang, pick } = useLang();
  const { user, profile } = useAuth();
  const [params] = useSearchParams();
  const [gen, setGen] = useState({ loading: false, error: false });
  const [session, setSession] = useState(null);
  const auto = useRef(false);
  const { loading, error, data, reload } = useLoad(() => db.listMistakes(user), [user.id]);

  async function practice(subject, topic) {
    setGen({ loading: true, error: false });
    try {
      const r = await generateExercises({ subject, topic, grade: profile.grade }, lang);
      setSession({ key: 1, questions: r.questions, meta: { subject, topic, grade: profile.grade }, demo: r.demo });
      setGen({ loading: false, error: false });
    } catch {
      setGen({ loading: false, error: true });
    }
  }

  useEffect(() => {
    if (auto.current) return;
    auto.current = true;
    const s = params.get('s');
    const tp = params.get('t');
    if (s && tp && TOPICS[tp]) practice(s, tp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gen.loading) return <div className="container page"><Loader text={t('tp_generating')} /></div>;

  if (session) {
    return (
      <div className="container page narrow">
        {session.demo && <DemoBanner>{t('demo_ai')}</DemoBanner>}
        <QuizSession
          key={session.key}
          questions={session.questions}
          meta={session.meta}
          onRetake={() => setSession((s) => ({ ...s, key: s.key + 1 }))}
          onExit={() => { setSession(null); reload(); }}
        />
      </div>
    );
  }

  if (loading) return <div className="container page"><Loader /></div>;
  if (error) return <div className="container page"><ErrorBox onRetry={reload} /></div>;

  const counts = {};
  data.forEach((m) => { counts[m.topic] = (counts[m.topic] || 0) + 1; });

  return (
    <div className="container page">
      <div className="page-head"><div><h1>{t('tp_title')}</h1><p className="muted">{t('tp_sub')}</p></div></div>
      {gen.error && <ErrorBox message={t('tp_err')} />}
      {Object.entries(SUBJECTS).map(([sk, sv]) => (
        <section key={sk} className="gap-top">
          <h3 className="section-title">{pick(sv)}</h3>
          <div className="grid grid-3">
            {Object.entries(TOPICS)
              .filter(([, v]) => v.subject === sk)
              .sort((a, b) => (counts[b[0]] || 0) - (counts[a[0]] || 0))
              .map(([tk, tv]) => (
                <article key={tk} className="card topic-card">
                  <div className="row-between">
                    <h4>{pick(tv.name)}</h4>
                    {counts[tk] > 0 && <span className="chip chip-bad">{t('tp_weak')} · {counts[tk]}</span>}
                  </div>
                  <p className="muted">{t('grade_n', { n: `${tv.grades[0]}–${tv.grades[1]}` })}</p>
                  <button className="btn btn-outline btn-sm" onClick={() => practice(sk, tk)}><Dumbbell size={16} /> {t('tp_gen')}</button>
                </article>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
