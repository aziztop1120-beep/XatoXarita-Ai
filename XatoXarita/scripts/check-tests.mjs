// Testlar sifatini tekshiradi:  node scripts/check-tests.mjs
// 1) to‘g‘ri javob eng uzun variant bo‘lib ajralib qolmasin; 2) 4 ta turli variant; 3) takroriy savol yo‘q.
import { QUESTIONS } from '../src/lib/questions.js';
const L = (s) => String(s).length;
let fail = 0;
const seen = new Set();
const by = {};
for (const x of QUESTIONS) {
  const c = x.options[x.a], others = x.options.filter((_, i) => i !== x.a);
  if (x.options.length !== 4 || new Set(x.options).size !== 4) { console.log('XATO variantlar:', x.id, x.q); fail++; }
  if (seen.has(x.q + c)) { console.log('TAKROR:', x.id, x.q); fail++; }
  seen.add(x.q + c);
  const t = (by[x.topic] ??= { n: 0, longest: 0, muchLonger: 0 });
  t.n++;
  if (L(c) > Math.max(...others.map(L))) t.longest++;
  if (L(c) >= 1.4 * Math.max(...others.map(L))) t.muchLonger++;
}
let N = 0, LG = 0, ML = 0;
for (const [k, v] of Object.entries(by)) {
  N += v.n; LG += v.longest; ML += v.muchLonger;
  const pct = (100 * v.longest) / v.n;
  const flag = pct > 40 || v.muchLonger / v.n > 0.1 ? '  <-- TUZATISH KERAK' : '';
  if (flag) fail++;
  console.log(k.padEnd(12), String(v.n).padStart(3), 'ta | eng uzun javob:', pct.toFixed(0).padStart(3) + '%', '| 1.4x uzun:', v.muchLonger, flag);
}
console.log(`\nJAMI ${N} ta savol | to‘g‘ri javob eng uzun: ${((100 * LG) / N).toFixed(1)}% (tasodifiy kutilma ≈ 25-30%) | 1.4x uzun: ${ML}`);
process.exit(fail ? 1 : 0);
