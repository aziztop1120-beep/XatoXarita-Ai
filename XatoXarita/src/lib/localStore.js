// Supabase sozlanmagan bo'lganda ishlaydigan DEMO saqlash (brauzer localStorage).
// Parollar SHA-256 hash ko'rinishida saqlanadi. Bu faqat sinov uchun!
const read = (k, d) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? d
  } catch {
    return d
  }
}
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v))

async function sha(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, '0')).join('')
}
const pub = (u) => ({ id: u.id, email: u.email, name: u.name })
const uuid = () =>
  crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2)

export const localAuth = {
  getUser() {
    const id = read('xx_session', null)
    const u = read('xx_users', []).find((x) => x.id === id)
    return u ? pub(u) : null
  },
  async signUp({ name, email, password }) {
    const users = read('xx_users', [])
    const mail = email.toLowerCase()
    if (users.some((u) => u.email === mail)) throw new Error('exists')
    const u = { id: uuid(), email: mail, name, hash: await sha(password) }
    write('xx_users', [...users, u])
    write('xx_session', u.id)
    return pub(u)
  },
  async signIn({ email, password }) {
    const u = read('xx_users', []).find((x) => x.email === email.toLowerCase())
    if (!u || u.hash !== (await sha(password))) throw new Error('invalid_login')
    write('xx_session', u.id)
    return pub(u)
  },
  signOut() {
    localStorage.removeItem('xx_session')
  },
  async resetPassword(email, password) {
    const users = read('xx_users', [])
    const u = users.find((x) => x.email === email.toLowerCase())
    if (!u) throw new Error('invalid_login')
    u.hash = await sha(password)
    write('xx_users', users)
  },
}

export const localDb = {
  getProfile: async (uid) => read('xx_profile_' + uid, null),
  saveProfile: async (uid, p) => {
    const v = { ...read('xx_profile_' + uid, {}), ...p, id: uid }
    write('xx_profile_' + uid, v)
    return v
  },
  async addResult(uid, result, mistakes) {
    const row = { id: uuid(), user_id: uid, created_at: new Date().toISOString(), ...result }
    write('xx_results_' + uid, [...read('xx_results_' + uid, []), row])
    const ms = mistakes.map((m) => ({ ...m, id: uuid(), user_id: uid, result_id: row.id, created_at: row.created_at }))
    write('xx_mistakes_' + uid, [...read('xx_mistakes_' + uid, []), ...ms])
    return row
  },
  listResults: async (uid) => read('xx_results_' + uid, []),
  listMistakes: async (uid) => [...read('xx_mistakes_' + uid, [])].reverse(),
}
