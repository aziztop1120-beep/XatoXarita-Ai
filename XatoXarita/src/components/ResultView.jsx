import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Sparkles, Trophy } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { analyzeMistakes } from '../services/ai.js';
import { db } from '../services/db.js';
import { topicName } from '../lib/stats.js';
import DemoBanner from './DemoBanner.jsx';
import Loader from './Loader.jsx';

export default function ResultView({ questions, answers, meta, onRetake, onExit }) {
  const { t, lang } = useLang();
  const { user, profile } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [demo, setDemo] = useState(false);
  const [saved, setSaved] = useState(null);
  const started = useRef(false);

  const wrong = questions
    .map((q, idx) => ({ q, chosen: answers[idx] }))
    .filter((x) => x.chosen !== x.q.a);
  const total = questions.length;
  const score = total - wrong.length;

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      let results = [];
      if (wrong.length) {
        const items = wrong.map((w) => ({
          question: w.q.q, options: w.q.options,
          chosen: w.chosen == null ? t('r_no_answer') : w.q.options[w.chosen], correct: w.q.options[w.q.a],
          topic: topicName(w.q.topic, 'uz'),
          fallbackExplanation: w.q.e || '', fallbackReason: t('demo_reason'),
        }));
        const r = await analyzeMistakes(items, lang);
        results = r.results;
        setDemo(r.demo);
      }
      setAnalysis(results);
      try {
        await db.saveAttempt(
          user,
          { subject: meta.subject, topic: meta.topic || 'all', grade: meta.grade || profile.grade, score, total },
          wrong.map((w, k) => ({
            question_id: w.q.id, subject: w.q.subject, topic: w.q.topic, question: w.q.q,
            options: w.q.options, user_answer: w.chosen, correct_answer: w.q.a,
            explanation: results[k]?.explanation || '', reason: results[k]?.reason || '',
          }))
        );
        setSaved('ok');
      } catch (e) {
        console.error(e);
        setSaved('fail');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct = Math.round((score / total) * 100);

  return (
    <div className="result">
      <section className="card result-hero">
        <div className="score-ring" style={{ '--p': pct }}><strong>{pct}%</strong></div>
        <div>
          <h2>{t('r_title')}: {score} / {total}</h2>
          {wrong.length === 0 && <p className="ok-text"><Trophy size={18} /> {t('r_perfect')}</p>}
          {saved === 'ok' && <p className="muted">✓ {t('r_saved')}</p>}
          {saved === 'fail' && <p className="error-text">{t('r_save_fail')}</p>}
        </div>
      </section>

      {demo && <DemoBanner>{t('demo_ai')}</DemoBanner>}

      {wrong.length > 0 && <h3 className="section-title">{t('r_mistakes')}</h3>}
      {wrong.length > 0 && !analysis && <Loader text={t('r_analyzing')} />}

      {analysis && wrong.map((w, k) => (
        <article key={k} className="card mistake">
          <div className="chip">{topicName(w.q.topic, lang)}</div>
          <h4>{w.q.q}</h4>
          <p className="row bad"><XCircle size={18} /> <span><b>{t('r_yours')}:</b> {w.chosen == null ? t('r_no_answer') : w.q.options[w.chosen]}</span></p>
          <p className="row good"><CheckCircle2 size={18} /> <span><b>{t('r_correct')}:</b> {w.q.options[w.q.a]}</span></p>
          <div className="ai-note">
            <p><Sparkles size={15} /> <b>{t('r_expl')}:</b> {analysis[k]?.explanation}</p>
            <p><b>{t('r_reason')}:</b> {analysis[k]?.reason}</p>
          </div>
        </article>
      ))}

      <div className="result-actions">
        <button className="btn btn-primary" onClick={onRetake}>{t('r_retake')}</button>
        {wrong.length > 0 && (
          <Link className="btn btn-outline" to={`/topics?s=${wrong[0].q.subject}&t=${wrong[0].q.topic}`}>{t('r_practice')}</Link>
        )}
        <Link className="btn btn-outline" to="/error-map">{t('r_map')}</Link>
        <button className="btn btn-ghost" onClick={onExit}>{t('r_new')}</button>
      </div>
    </div>
  );
}
