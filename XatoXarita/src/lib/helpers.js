export const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0)

export const fmtDate = (iso, lang) =>
  new Date(iso).toLocaleDateString(lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

// Natijalardan mavzular bo'yicha statistika: { topic: {correct,total} }
export function topicStats(results) {
  const acc = {}
  results.forEach((r) => {
    Object.entries(r.topic_stats || {}).forEach(([topic, s]) => {
      acc[topic] ??= { correct: 0, total: 0 }
      acc[topic].correct += s.correct
      acc[topic].total += s.total
    })
  })
  return acc
}

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
