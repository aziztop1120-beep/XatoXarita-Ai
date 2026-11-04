// Supabase Edge Function: AI proksi. API kaliti faqat shu yerda (secret) saqlanadi.
// Joylash: supabase functions deploy ai
// Kalit:   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...   (ixtiyoriy: AI_MODEL=...)

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

const LANG: Record<string, string> = { uz: 'Uzbek (Latin script)', ru: 'Russian', en: 'English' }

async function ask(prompt: string, key: string) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: Deno.env.get('AI_MODEL') || 'claude-sonnet-5-5',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!res.ok) throw new Error('AI request failed')
  const data = await res.json()
  const text = (data.content || []).map((b: { text?: string }) => b.text || '').join('')
  return JSON.parse(text.replace(/```json|```/g, '').trim())
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  const key = Deno.env.get('ANTHROPIC_API_KEY')
  if (!key) return json({ error: 'AI_NOT_CONFIGURED' })

  try {
    const b = await req.json()
    const lang = LANG[b.lang] || LANG.en

    if (b.task === 'analyze') {
      const out = await ask(
        `You are a friendly school tutor. A student answered a test question incorrectly.
Question: ${String(b.question).slice(0, 500)}
Options: ${JSON.stringify(b.options).slice(0, 500)}
Student's answer: ${String(b.userAnswer).slice(0, 100)}
Correct answer: ${String(b.correctAnswer).slice(0, 100)}
Write in ${lang}. Reply ONLY with JSON: {"explanation": "simple step-by-step explanation of the correct answer (max 3 sentences)", "reason": "the likely reason the student made this mistake (1-2 sentences)"}`,
        key
      )
      return json({ explanation: out.explanation, reason: out.reason })
    }

    if (b.task === 'exercises') {
      const count = Math.min(Number(b.count) || 3, 5)
      const out = await ask(
        `Create ${count} new multiple-choice school exercises. Subject: ${String(b.subject).slice(0, 30)}. Topic: ${String(b.topic).slice(0, 30)}.
Write in ${lang}. Each has exactly 4 options and one correct option. Reply ONLY with JSON:
{"items":[{"q":"question","options":["a","b","c","d"],"answer":0,"explanation":"short explanation"}]}
"answer" is the zero-based index of the correct option.`,
        key
      )
      return json({ items: out.items })
    }
    return json({ error: 'UNKNOWN_TASK' }, 400)
  } catch {
    return json({ error: 'AI_FAILED' })
  }
})
