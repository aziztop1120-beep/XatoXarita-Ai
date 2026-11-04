export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export function validateRegister(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'e_name';
  if (!isEmail(v.email)) e.email = 'e_email';
  if (v.password.length < 8) e.password = 'e_pass';
  if (v.confirm !== v.password) e.confirm = 'e_match';
  return e;
}

export function validateLogin(v) {
  const e = {};
  if (!isEmail(v.email)) e.email = 'e_email';
  if (!v.password) e.password = 'e_required';
  return e;
}

export function errMsg(err, t) {
  const m = (err?.message || '').toLowerCase();
  if (m.includes('invalid login')) return t('e_invalid_login');
  if (m.includes('already registered') || m.includes('already been registered')) return t('e_exists');
  if (m.includes('rate limit')) return t('e_rate');
  return t('e_generic');
}
