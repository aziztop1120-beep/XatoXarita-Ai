import { useState } from 'react';
import { useLang } from '../i18n/LangContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { SUBJECTS, TOPICS, buildTest } from '../lib/questions.js';
import Field from '../components/Field.jsx';
import QuizSession from '../components/QuizSession.jsx';

export default function Tests() {
  const { t, pick } = useLang();
  const { profile } = useAuth();
  const [form, setForm] = useState({ subject: 'math', topic: 'all', grade: profile.grade || 7 });
  const [session, setSession] = useState(null);
  const [none, setNone] = useState(false);

  const topics = Object.entries(TOPICS).filter(([, v]) => v.subject === form.subject);

  function start() {
    const questions = buildTest(form);
    if (!questions.length) { setNone(true); return; }
    setNone(false);
    setSession({ key: 1, questions, meta: { ...form } });
  }

  if (session) {
    return (
      <div className="container page narrow">
        <QuizSession
          key={session.key}
          questions={session.questions}
          meta={session.meta}
          onRetake={() => setSession((s) => ({ ...s, key: s.key + 1 }))}
          onExit={() => setSession(null)}
        />
      </div>
    );
  }

  return (
    <div className="container page narrow">
      <div className="page-head"><div><h1>{t('t_title')}</h1><p className="muted">{t('t_sub')}</p></div></div>
      <section className="card form-card">
        <Field id="subject" label={t('subject')}>
          <select id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value, topic: 'all' })}>
            {Object.entries(SUBJECTS).map(([k, v]) => <option key={k} value={k}>{pick(v)}</option>)}
          </select>
        </Field>
        <Field id="grade" label={t('f_grade')}>
          <select id="grade" value={form.grade} onChange={(e) => setForm({ ...form, grade: Number(e.target.value) })}>
            {[5, 6, 7, 8, 9, 10, 11].map((g) => <option key={g} value={g}>{t('grade_n', { n: g })}</option>)}
          </select>
        </Field>
        <Field id="topic" label={t('topic')}>
          <select id="topic" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
            <option value="all">{t('all_topics')}</option>
            {topics.map(([k, v]) => <option key={k} value={k}>{pick(v.name)}</option>)}
          </select>
        </Field>
        {none && <p className="form-error" role="alert">{t('t_none')}</p>}
        <button className="btn btn-primary btn-block" onClick={start}>{t('start_test')}</button>
      </section>
    </div>
  );
}
