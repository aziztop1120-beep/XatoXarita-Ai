import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Dumbbell, Map } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { listMistakes, listResults } from '../lib/db'
import { pct, topicStats } from '../lib/helpers'
import { SUBJECTS, getQuestion } from '../data/questions'
import { EmptyState, ErrorState, Loader, PageHeader, ProgressBar } from '../components/Ui'

export default function MistakeMap() {
  const { t, lang } = useLang()
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)

  const load = useCallback(() => {
    setError(false)
    setData(null)
    Promise.all([listResults(user.id), listMistakes(user.id)])
      .then(([results, mistakes]) => setData({ results, mistakes }))
      .catch(() => setError(true))
  }, [user.id])
  useEffect(load, [load])

  if (error) return <div className="container page"><ErrorState onRetry={load} /></div>
  if (!data) return <div className="container page"><Loader /></div>

  const stats = topicStats(data.results)
  const counts = {}
  data.mistakes.forEach((m) => (counts[m.topic] = (counts[m.topic] || 0) + 1))

  const topics = Object.entries(SUBJECTS)
    .flatMap(([subject, list]) => list.map((topic) => ({ subject, topic, s: stats[topic] })))
    .filter((x) => x.s)
    .map((x) => ({ ...x, acc: pct(x.s.correct, x.s.total), mist: counts[x.topic] || 0 }))
    .sort((a, b) => a.acc - b.acc)

  return (
    <div className="container page">
      <PageHeader title={t('map_title')} subtitle={t('map_sub')} />
      {topics.length === 0 ? (
        <div className="card">
          <EmptyState icon={Map} text={t('map_empty')} action={<Link to="/tests" className="btn btn--primary">{t('dash_start')}</Link>} />
        </div>
      ) : (
        <>
          <div className="grid grid--3">
            {topics.map(({ subject, topic, acc, mist }) => (
              <div className="card map-card" key={topic}>
                <div className="map-card__head">
                  <div>
                    <small>{t(`sub_${subject}`)}</small>
                    <h3>{t(`top_${topic}`)}</h3>
                  </div>
                  <span className={`badge badge--${acc >= 80 ? 'good' : acc >= 50 ? 'mid' : 'bad'}`}>{acc}%</span>
                </div>
                <ProgressBar value={acc} />
                <p className="map-card__meta">{mist} {t('map_mist')} · {t('map_acc')} {acc}%</p>
                <Link to={`/topics?topic=${topic}`} className="btn btn--outline btn--sm"><Dumbbell size={16} /> {t('map_practice')}</Link>
              </div>
            ))}
          </div>

          {data.mistakes.length > 0 && (
            <>
              <h2 className="block-title">{t('map_recent')}</h2>
              <div className="card list">
                {data.mistakes.slice(0, 6).map((m) => {
                  const q = getQuestion(m.question_id)
                  if (!q) return null
                  return (
                    <div className="list__row list__row--col" key={m.id}>
                      <div><span className="tag">{t(`top_${m.topic}`)}</span> <strong>{q.q[lang]}</strong></div>
                      <small>{t('tests_correct')}: <b>{q.options[m.correct_answer]}</b> — {q.explain[lang]}</small>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
