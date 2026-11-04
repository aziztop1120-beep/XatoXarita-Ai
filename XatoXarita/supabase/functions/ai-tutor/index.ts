// Supabase Edge Function: AI kaliti serverda saqlanadi, frontendga chiqmaydi.
// Deploy:  supabase functions deploy ai-tutor
// Kalit:   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const LANGS: Record<string, string> = { uz: 'Uzbek (Latin script)', ru: 'Russian', en: 'English' };

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const { task, payload, lang } = await req.json();
    const key = Deno.env.get('ANTHROPIC_API_KEY');
    if (!key) return json({ error: 'ANTHROPIC_API_KEY sozlanmagan' }, 500);
    const language = LANGS[lang] ?? LANGS.uz;

    let prompt = '';
    if (task === 'analyze') {
      const items = (payload.items ?? []).slice(0, 20).map((i: any) => ({
        question: i.question, options: i.options, student_answer: i.chosen, correct_answer: i.correct, topic: i.topic,
      }));
      prompt = `You are a kind school tutor. For EACH mistake below write, in ${language}: "explanation" (simple, 1-3 sentences, why the correct answer is right) and "reason" (1 sentence: the likely cause of the student's mistake).
Return ONLY a JSON array with exactly ${items.length} objects in the same order: [{"explanation":"...","reason":"..."}]. No markdown.
Mistakes: ${JSON.stringify(items)}`;
    } else if (task === 'generate') {
      const { subject, topic, grade, count } = payload;
      const n = Math.min(Number(count) || 5, 8);
      prompt = `Create ${n} multiple-choice practice questions for grade ${Number(grade) || 7} students.
Subject: ${String(subject).slice(0, 60)}. Topic: ${String(topic).slice(0, 80)}. Write everything in ${language}.
Each question has exactly 4 options, one correct. Return ONLY a JSON array: [{"q":"...","options":["..","..","..",".."],"a":<index 0-3 of correct option>,"e":"short explanation"}]. No markdown.`;
    } else {
      return json({ error: 'noma’lum vazifa' }, 400);
    }

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 2500, messages: [{ role: 'user', content: prompt }] }),
    });
    if (!r.ok) return json({ error: 'AI xatosi', status: r.status }, 502);
    const d = await r.json();
    const text: string = d.content?.[0]?.text ?? '';
    const clean = text.replace(/```json|```/g, '').trim();
    return json({ data: JSON.parse(clean) });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
