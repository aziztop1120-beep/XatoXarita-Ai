import { useMemo, useState } from 'react';
import { Users, ClipboardCheck, Percent, XCircle, Search, Download, ArrowLeft } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { adminApi } from '../services/db.js';
import { isSupabase } from '../lib/supabase.js';
import { useLoad } from '../lib/useLoad.js';
import { SUBJECTS } from '../lib/questions.js';
import { pct, weakTopics, topicName, subjectName } from '../lib/stats.js';
import Loader from '../components/Loader.jsx';
import ErrorBox from '../components/ErrorBox.jsx';
import EmptyState from '../components/EmptyState.jsx';
import DemoBanner from '../components/DemoBanner.jsx';

const displayName = (p) => p.name || p.email || String(p.id).slice(0, 8);
const fmtDate = (d) => (d ? new Date(d).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '—');
const avgBadge = (v) => (v === null ? '' : v >= 80 ? 'chip-ok' : v >= 55 ? 'chip-mid' : 'chip-bad');
const optText = (m, idx) => (Number.isInteger(idx) && Array.isArray(m.options) ? m.options[idx] : null);

function downloadCsv(name, rows) {
  const esc = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;
  const csv = '\uFEFF' + rows.map((r) => r.map(esc).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

export default function Admin() {
  const { t, lang, pick } = useLang();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('all');
  const [sort, setSort] = useState('mistakes');
  const [selId, setSelId] = useState(null);
  const { loading, error, data, reload } = useLoad(() => adminApi.loadAll(), [user.id]);

  const rows = useMemo(() => {
    if (!data) return [];
    const ok = (x) => subject === 'all' || x.subject === subject;
    const group = (arr) => arr.filter(ok).reduce((m, x) => { (m[x.user_id] ||= []).push(x); return m; }, {});
    const A = group(data.attempts), M = group(data.mistakes);
    return data.profiles.filter((p) => p.role !== 'teacher').map((p) => {
      const attempts = A[p.id] || [], mistakes = M[p.id] || [];
      const avg = attempts.length ? Math.round(attempts.reduce((s, a) => s + pct(a), 0) / attempts.length) : null;
      const last = [...attempts, ...mistakes].map((x) => x.created_at).sort().pop() || null;
      return { ...p, attempts, mistakes, avg, last };
    });
  }, [data, subject]);

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    const f = rows.filter((r) => !q || displayName(r).toLowerCase().includes(q) || (r.email || '').toLowerCase().includes(q));
    const cmp = {
      mistakes: (a, b) => b.mistakes.length - a.mistakes.length,
      low: (a, b) => (a.avg ?? 999) - (b.avg ?? 999),
      recent: (a, b) => String(b.last || '').localeCompare(String(a.last || '')),
      name: (a, b) => displayName(a).localeCompare(displayName(b)),
    }[sort];
    return [...f].sort(cmp);
  }, [rows, search, sort]);

  const summary = useMemo(() => {
    const allAttempts = rows.flatMap((r) => r.attempts);
    return {
      students: rows.length,
      active: rows.filter((r) => r.attempts.length).length,
      tests: allAttempts.length,
      avg: allAttempts.length ? Math.round(allAttempts.reduce((s, a) => s + pct(a), 0) / allAttempts.length) : 0,
      mistakes: rows.reduce((s, r) => s + r.mistakes.length, 0),
    };
  }, [rows]);

  const classWeak = useMemo(() => {
    const map = {};
    rows.forEach((r) => r.mistakes.forEach((m) => {
      const k = `${m.subject}|${m.topic}`;
      map[k] ||= { subject: m.subject, topic: m.topic, count: 0, who: new Set() };
      map[k].count += 1; map[k].who.add(r.id);
    }));
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 6);
  }, [rows]);

  if (loading) return <div className="container page"><Loader /></div>;
  if (error) return <div className="container page"><ErrorBox onRetry={reload} /></div>;

  const exportMistakes = (students, file) => downloadCsv(file, [
    ['Ism', 'Email', 'Sinf', 'Fan', 'Mavzu', 'Savol', 'Tanlagan javob', 'To‘g‘ri javob', 'Sana'],
    ...students.flatMap((r) => r.mistakes.map((m) => [
      displayName(r), r.email, r.grade, subjectName(m.subject, 'uz'), topicName(m.topic, 'uz'), m.question,
      optText(m, m.user_answer) ?? '', optText(m, m.correct_answer) ?? '', fmtDate(m.created_at),
    ])),
  ]);

  const sel = selId ? rows.find((r) => r.id === selId) : null;

  // ---------- Bitta o‘quvchi ----------
  if (sel) {
    const topics = weakTopics(sel.mistakes);
    return (
      <div className="container page">
        <button className="btn btn-ghost btn-sm" onClick={() => setSelId(null)}><ArrowLeft size={16} /> {t('ad_back')}</button>
        <div className="page-head gap-top">
          <div><h1>{displayName(sel)}</h1><p className="muted">{sel.email} · {t('grade_n', { n: sel.grade })}</p></div>
          <div className="head-actions">
            <button className="btn btn-outline" onClick={() => exportMistakes([sel], `${displayName(sel)}-xatolar.csv`)}><Download size={16} /> {t('ad_export')}</button>
          </div>
        </div>
        <div className="grid grid-3">
          <div className="card stat"><strong>{sel.attempts.length}</strong><span className="muted">{t('ad_s_tests')}</span></div>
          <div className="card stat"><strong>{sel.avg === null ? '—' : `${sel.avg}%`}</strong><span className="muted">{t('ad_s_avg')}</span></div>
          <div className="card stat"><strong>{sel.mistakes.length}</strong><span className="muted">{t('ad_s_mistakes')}</span></div>
        </div>

        <section className="card gap-top">
          <h3>{t('ad_by_topic')}</h3>
          {topics.length === 0 ? <EmptyState title={t('m_empty_t')} text={t('m_empty_d')} /> : topics.map((w) => (
            <details key={`${w.subject}${w.topic}`} className="mdetails">
              <summary>
                <b>{topicName(w.topic, lang)}</b><span className="muted"> · {subjectName(w.subject, lang)}</span>
                <span className="chip chip-bad">{t('ad_weak_mistakes', { n: w.count })}</span>
              </summary>
              {w.items.map((m) => {
                const chosen = optText(m, m.user_answer);
                return (
                  <div key={m.id} className="mistake">
                    <p><b>{m.question}</b></p>
                    <p className="ans-bad">{t('ad_chosen')}: {chosen ?? t('ad_noanswer')}</p>
                    <p className="ans-good">{t('ad_correct')}: {optText(m, m.correct_answer) ?? '—'}</p>
                    {m.explanation && <p className="muted">{m.explanation}</p>}
                    <p className="muted small">{fmtDate(m.created_at)}</p>
                  </div>
                );
              })}
            </details>
          ))}
        </section>

        <section className="card gap-top">
          <h3>{t('ad_attempts')}</h3>
          {sel.attempts.length === 0 ? <p className="muted">{t('ad_no_tests')}</p> : (
            <div className="table-wrap">
              <table className="atable">
                <thead><tr><th>{t('ad_date')}</th><th>{t('ad_test')}</th><th>{t('ad_result')}</th></tr></thead>
                <tbody>
                  {sel.attempts.map((a) => (
                    <tr key={a.id}>
                      <td>{fmtDate(a.created_at)}</td>
                      <td>{subjectName(a.subject, lang)} · {topicName(a.topic, lang, t('all_topics'))}</td>
                      <td>{a.score}/{a.total} <span className={`chip ${avgBadge(pct(a))}`}>{pct(a)}%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    );
  }

  // ---------- Umumiy ro‘yxat ----------
  const stats = [
    [Users, t('ad_s_students'), summary.students],
    [ClipboardCheck, t('ad_s_active'), summary.active],
    [ClipboardCheck, t('ad_s_tests'), summary.tests],
    [Percent, t('ad_s_avg'), `${summary.avg}%`],
    [XCircle, t('ad_s_mistakes'), summary.mistakes],
  ];
  const maxWeak = classWeak[0]?.count || 1;

  return (
    <div className="container page">
      <div className="page-head">
        <div><h1>{t('ad_title')}</h1><p className="muted">{t('ad_sub')}</p></div>
        <div className="head-actions">
          <button className="btn btn-outline" onClick={() => exportMistakes(list, 'xatolar.csv')}><Download size={16} /> {t('ad_export')}</button>
        </div>
      </div>
      {!isSupabase && <DemoBanner>{t('ad_demo_note')}</DemoBanner>}

      <div className="admin-stats">
        {stats.map(([Icon, label, value]) => (
          <div key={label} className="card stat">
            <span className="icon-box"><Icon size={20} /></span>
            <strong>{value}</strong><span className="muted">{label}</span>
          </div>
        ))}
      </div>

      <div className="admin-filters">
        <div className="search">
          <Search size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('ad_search')} aria-label={t('ad_search')} />
        </div>
        <select value={subject} onChange={(e) => setSubject(e.target.value)} aria-label={t('subject')}>
          <option value="all">{t('ad_all_subjects')}</option>
          {Object.entries(SUBJECTS).map(([k, v]) => <option key={k} value={k}>{pick(v)}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
          <option value="mistakes">{t('ad_sort_mistakes')}</option>
          <option value="low">{t('ad_sort_low')}</option>
          <option value="recent">{t('ad_sort_recent')}</option>
          <option value="name">{t('ad_sort_name')}</option>
        </select>
      </div>

      <div className="grid grid-2 admin-main">
        <section className="card">
          {list.length === 0 ? <EmptyState title={t('ad_empty_t')} text={t('ad_empty_d')} /> : (
            <div className="table-wrap">
              <table className="atable">
                <thead>
                  <tr><th>{t('ad_c_student')}</th><th>{t('ad_c_grade')}</th><th>{t('ad_c_tests')}</th><th>{t('ad_c_avg')}</th><th>{t('ad_c_mistakes')}</th><th>{t('ad_c_last')}</th></tr>
                </thead>
                <tbody>
                  {list.map((r) => (
                    <tr key={r.id} className="click" tabIndex={0} onClick={() => setSelId(r.id)} onKeyDown={(e) => e.key === 'Enter' && setSelId(r.id)}>
                      <td><b>{displayName(r)}</b>{r.name && r.email && <div className="muted small">{r.email}</div>}</td>
                      <td>{r.grade}</td>
                      <td>{r.attempts.length}</td>
                      <td>{r.avg === null ? <span className="muted">{t('ad_no_tests')}</span> : <span className={`chip ${avgBadge(r.avg)}`}>{r.avg}%</span>}</td>
                      <td>{r.mistakes.length ? <span className="chip chip-bad">{r.mistakes.length}</span> : 0}</td>
                      <td className="muted small">{fmtDate(r.last)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="card">
          <h3>{t('ad_weak_title')}</h3>
          {classWeak.length === 0 ? <EmptyState title={t('m_empty_t')} text={t('m_empty_d')} /> : classWeak.map((w) => (
            <div key={`${w.subject}${w.topic}`} className="bar-row">
              <div><b>{topicName(w.topic, lang)}</b><span className="muted"> · {subjectName(w.subject, lang)}</span></div>
              <span className="muted small">{t('ad_weak_students', { n: w.who.size })} · {t('ad_weak_mistakes', { n: w.count })}</span>
              <div className="hbar"><span style={{ width: `${(w.count / maxWeak) * 100}%` }} /></div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
