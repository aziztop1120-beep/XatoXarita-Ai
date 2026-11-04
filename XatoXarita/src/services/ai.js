import { supabase, aiEnabled } from '../lib/supabase.js';
import { QUESTIONS, TOPICS, SUBJECTS, normSubject, shuffle, shuffleOptions } from '../lib/questions.js';

// AI chaqiruvlari faqat Supabase Edge Function ("ai-tutor") orqali o‘tadi.
// API kaliti brauzerga HECH QACHON tushmaydi.
async function callAI(task, payload, lang) {
  const { data, error } = await supabase.functions.invoke('ai-tutor', { body: { task, payload, lang } });
  if (error || !data?.data) throw error || new Error('AI javob bermadi');
  return data.data;
}

export async function analyzeMistakes(items, lang) {
  if (aiEnabled) {
    try {
      const res = await callAI('analyze', { items }, lang);
      if (Array.isArray(res) && res.length === items.length) {
        return {
          demo: false,
          results: res.map((r) => ({ explanation: String(r.explanation || ''), reason: String(r.reason || '') })),
        };
      }
    } catch (e) { console.warn('AI tahlil xatosi, demo rejimga o‘tildi', e); }
  }
  return { demo: true, results: items.map((i) => ({ explanation: i.fallbackExplanation, reason: i.fallbackReason })) };
}

const validQ = (x) =>
  x && typeof x.q === 'string' && Array.isArray(x.options) && x.options.length === 4 &&
  Number.isInteger(x.a) && x.a >= 0 && x.a < 4;

export async function generateExercises({ subject, topic, grade, count = 5 }, lang) {
  if (aiEnabled) {
    try {
      const res = await callAI('generate', {
        subject: SUBJECTS[normSubject(subject)].en, topic: TOPICS[topic].name.en, grade, count,
      }, lang);
      const list = (Array.isArray(res) ? res : []).filter(validQ);
      if (list.length) {
        return {
          demo: false,
          questions: list.slice(0, count).map((x, i) => ({
            id: `ai-${Date.now()}-${i}`, topic, subject, q: x.q,
            options: x.options.map(String), a: x.a, e: String(x.e || ''),
          })),
        };
      }
    } catch (e) { console.warn('AI mashq xatosi, demo rejimga o‘tildi', e); }
  }
  const pool = QUESTIONS.filter((x) => x.topic === topic);
  return { demo: true, questions: shuffle(pool).slice(0, count).map(shuffleOptions) };
}
