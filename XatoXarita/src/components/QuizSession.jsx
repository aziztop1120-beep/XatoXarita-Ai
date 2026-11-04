import { useEffect, useState } from 'react';
import { Timer, ChevronLeft } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { subjectName, topicName } from '../lib/stats.js';
import ResultView from './ResultView.jsx';

// Butun test uchun beriladigan umumiy vaqt: 20 daqiqa (30 ta savol)
// Har bir savolga 40 soniya: 30 ta savol = 20 daqiqa, 5 ta mashq = 3:20
export const SECONDS_PER_QUESTION = 40;
const fmt = (sec) => `${String(Math.floor(Math.max(sec, 0) / 60)).padStart(2, '0')}:${String(Math.max(sec, 0) % 60).padStart(2, '0')}`;

export default function QuizSession({ questions, meta, onRetake, onExit }) {
  const { t, lang } = useLang();
   const total = questions.length;
  const totalSeconds = total * SECONDS_PER_QUESTION;
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState(() => Array(total).fill(null));
  const [left, setLeft] = useState(totalSeconds);
  const [done, setDone] = useState(false);

  // Umumiy taymer: savol almashganda qayta boshlanmaydi
  useEffect(() => {
    if (done) return undefined;
    const id = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [done]);

  // Vaqt tugasa — test avtomatik yakunlanadi (belgilangan javoblar hisobga olinadi)
  useEffect(() => {
    if (!done && left <= 0) setDone(true);
  }, [left, done]);

  if (done) {
    return <ResultView questions={questions} answers={answers} meta={meta} onRetake={onRetake} onExit={onExit} />;
  }

  const q = questions[i];
  const sel = answers[i];
  const last = i + 1 >= total;
  const low = left <= 60;

  function goNext() {
    if (i + 1 >= total) setDone(true); else setI(i + 1);
  }
  const choose = (idx) => setAnswers((a) => a.map((v, k) => (k === i ? idx : v)));

  return (
    <section className="card quiz">
      <div className="quiz-head">
        <span className="chip">{subjectName(meta.subject, lang)} · {topicName(q.topic, lang)}</span>
        <span className="muted">{t('q_of', { n: i + 1, total })}</span>
      </div>
      <div className="progress"><span style={{ width: `${(i / total) * 100}%` }} /></div>
      <div className="quiz-timer" role="timer" aria-live="off">
        <Timer size={16} className={low ? 'low' : ''} />
       <div className="timer-bar"><span className={low ? 'low' : ''} style={{ width: `${Math.max(left, 0) / totalSeconds * 100}%` }} /></div>
        <span className={`timer-num ${low ? 'low' : ''}`}>{fmt(left)}</span>
      </div>
      <h2 className="quiz-q">{q.q}</h2>
      <div className="options">
        {q.options.map((o, idx) => (
          <button key={idx} className={`option ${sel === idx ? 'selected' : ''}`} onClick={() => choose(idx)}>
            <span className="option-letter">{String.fromCharCode(65 + idx)}</span>{o}
          </button>
        ))}
      </div>
      <div className="quiz-foot">
        <button className="btn btn-ghost" onClick={onExit}>{t('q_exit')}</button>
        <div className="quiz-foot-right">
          <button className="btn btn-outline" disabled={i === 0} onClick={() => setI(i - 1)}>
            <ChevronLeft size={16} /> {t('q_prev')}
          </button>
          <button className="btn btn-primary" onClick={goNext}>{last ? t('finish') : sel === null ? t('q_skip') : t('next')}</button>
        </div>
      </div>
    </section>
  );
}