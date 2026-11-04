import { TOPICS, SUBJECTS, normSubject } from './questions.js';

export const pct = (a) => (a.total ? Math.round((a.score / a.total) * 100) : 0);

export function weakTopics(mistakes) {
  const map = {};
  mistakes.forEach((m) => {
    const subj = normSubject(m.subject);
    const k = `${subj}|${m.topic}`;
    map[k] ||= { subject: subj, topic: m.topic, count: 0, items: [] };
    map[k].count += 1;
    map[k].items.push(m);
  });
  return Object.values(map).sort((a, b) => b.count - a.count);
}

export const topicName = (topic, lang, allLabel = '') =>
  topic === 'all' ? allLabel : TOPICS[topic]?.name[lang] || topic;
export const subjectName = (subject, lang) => SUBJECTS[normSubject(subject)]?.[lang] || subject;

export function trend(attempts) {
  // attempts: eng yangisi birinchi
  if (attempts.length < 4) return null;
  const last = attempts.slice(0, 3).map(pct);
  const prev = attempts.slice(3).map(pct);
  const avg = (a) => a.reduce((s, x) => s + x, 0) / a.length;
  return Math.round(avg(last) - avg(prev));
}
