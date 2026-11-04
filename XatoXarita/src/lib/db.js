import { supabase, hasSupabase } from './supabase'
import { localDb } from './localStore'

const check = ({ data, error }) => {
  if (error) throw error
  return data
}

export async function getProfile(uid) {
  if (!hasSupabase) return localDb.getProfile(uid)
  return check(await supabase.from('profiles').select('*').eq('id', uid).maybeSingle())
}

export async function saveProfile(uid, p) {
  if (!hasSupabase) return localDb.saveProfile(uid, p)
  return check(await supabase.from('profiles').upsert({ id: uid, ...p }).select().single())
}

export async function addResult(uid, result, mistakes) {
  if (!hasSupabase) return localDb.addResult(uid, result, mistakes)
  const row = check(await supabase.from('test_results').insert({ user_id: uid, ...result }).select().single())
  if (mistakes.length) {
    check(
      await supabase
        .from('mistakes')
        .insert(mistakes.map((m) => ({ ...m, user_id: uid, result_id: row.id })))
    )
  }
  return row
}

export async function listResults(uid) {
  if (!hasSupabase) return localDb.listResults(uid)
  return check(
    await supabase.from('test_results').select('*').eq('user_id', uid).order('created_at', { ascending: true })
  )
}

export async function listMistakes(uid) {
  if (!hasSupabase) return localDb.listMistakes(uid)
  return check(
    await supabase.from('mistakes').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(200)
  )
}
