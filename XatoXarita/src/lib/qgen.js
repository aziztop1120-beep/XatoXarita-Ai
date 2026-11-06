// Matematika va fizika uchun SODDA va OSON savollar generatori (bir amalli, qisqa javoblar).
// Har yuklanishda parametrlar yangidan tanlanadi, to‘g‘ri javob hisoblab topiladi.
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[ri(0, arr.length - 1)];
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const num = (x) => String(Math.round(x * 100) / 100).replace('.', ',').replace('-', '−');
const fr = (n, d) => {
  const g = gcd(n, d) || 1;
  n /= g; d /= g;
  return d === 1 ? num(n) : `${num(n)}/${d}`;
};

// to‘g‘ri javob + noto‘g‘ri variantlar -> savol (to‘g‘ri javob 0-o‘rinda; test paytida aralashtiriladi)
function mk(topic, text, correct, wrongs, e, unit = '') {
  const f = (v) => (typeof v === 'number' ? num(v) : String(v)) + unit;
  correct = f(correct);
  const set = [];
  wrongs.map(f).forEach((w) => { if (w !== correct && !set.includes(w) && !/\/1$/.test(w)) set.push(w); });
  const n = parseFloat(correct.replace(',', '.').replace('−', '-'));
  const suffix = correct.replace(/^[−-]?\d+([.,]\d+)?/, '');
  if (set.length < 3 && !Number.isNaN(n) && /^[−-]?\d+([.,]\d+)?/.test(correct)) {
    for (const d of [1, -1, 2, -2, 10, -10, 5, -5, 3]) {
      const w = num(n + d) + suffix;
      if (w !== correct && !set.includes(w) && n + d > 0 && Number.isInteger(n + d)) set.push(w);
      if (set.length >= 3) break;
    }
  }
  if (set.length < 3) return null;
  return { topic, q: text, options: [correct, ...set.slice(0, 3)], a: 0, e };
}

const G = {};

G.fractions = [
  () => { const b = ri(3, 12), a = ri(1, b - 2), c = ri(1, b - a - 1);
    return mk('fractions', `${a}/${b} + ${c}/${b} = ?`, fr(a + c, b), [`${a + c}/${b * 2}`, fr(a * c, b), `${a + c}/${b + b}`, fr(Math.abs(a - c) || 1, b)],
      `Maxrajlar bir xil bo‘lsa, suratlar qo‘shiladi: ${a} + ${c} = ${a + c}, maxraj ${b} o‘zgarmaydi.`); },
  () => { const b = ri(4, 12), a = ri(2, b - 1), c = ri(1, a - 1);
    return mk('fractions', `${a}/${b} − ${c}/${b} = ?`, fr(a - c, b), [`${a - c}/${b - c}`, fr(a + c, b), `${a - c}/${b * 2}`, fr(a * c, b)],
      `Maxrajlar bir xil bo‘lsa, suratlar ayriladi: ${a} − ${c} = ${a - c}.`); },
  () => { const b = pick([2, 3, 4, 5, 6]), k = ri(2, 4), d = b * k;
    const N = d + k, ans = fr(N, d);
    return mk('fractions', `1/${b} + 1/${d} = ?`, ans, [`2/${b + d}`, `1/${b + d}`, fr(N + 1, d), `2/${d}`],
      `Umumiy maxraj ${d}: ${k}/${d} + 1/${d} = ${k + 1}/${d}.`); },
  () => { const b = pick([2, 3, 4, 5]), N = b * ri(2, 12), a = ri(1, b - 1);
    return mk('fractions', `${N} ning ${a}/${b} qismini toping.`, (N / b) * a, [N / b, N * a, N + a, (N / b) * a + b],
      `${N} ni ${b} ga bo‘lamiz: ${N / b}. Keyin ${a} ga ko‘paytiramiz: ${(N / b) * a}.`); },
  () => { const g = pick([2, 3, 4, 5]), [p, q] = pick([[1, 2], [1, 3], [2, 3], [3, 4], [1, 4], [2, 5], [3, 5], [1, 5]]);
    return mk('fractions', `${p * g}/${q * g} kasrni qisqartiring.`, `${p}/${q}`, [`${p * g}/${q}`, `${p}/${q * g}`, `${p + 1}/${q + 1}`, `${q}/${p + q}`],
      `Surat va maxrajni ${g} ga bo‘lamiz: ${p}/${q}.`); },
  () => { const a = ri(1, 4), b = ri(2, 5), c = ri(1, 4), d = ri(2, 5);
    return mk('fractions', `${a}/${b} · ${c}/${d} = ?`, fr(a * c, b * d), [`${a + c}/${b + d}`, fr(a * d, b * c), `${a * c}/${b + d}`, fr(a * c + 1, b * d)],
      `Ko‘paytirishda suratlar suratga, maxrajlar maxrajga ko‘paytiriladi: ${a * c}/${b * d}.`); },
];

G.equations = [
  () => { const x = ri(2, 15), a = ri(2, 20);
    return mk('equations', `x + ${a} = ${x + a} bo‘lsa, x = ?`, x, [x + a, a, x - 1, x + 1], `${x + a} − ${a} = ${x}.`); },
  () => { const x = ri(10, 25), a = ri(2, 9);
    return mk('equations', `x − ${a} = ${x - a} bo‘lsa, x = ?`, x, [x - a - a, x - a, x + a + 1, a], `${x - a} + ${a} = ${x}.`); },
  () => { const x = ri(2, 12), a = ri(2, 9);
    return mk('equations', `${a}x = ${a * x} bo‘lsa, x = ?`, x, [a * x, a, x + 1, a + x], `${a * x} : ${a} = ${x}.`); },
  () => { const x = ri(2, 10), a = ri(2, 5), b = ri(1, 9);
    return mk('equations', `${a}x + ${b} = ${a * x + b} bo‘lsa, x = ?`, x, [a * x, x + b, x - 1, x + 1], `${a}x = ${a * x + b} − ${b} = ${a * x}, x = ${x}.`); },
  () => { const x = ri(2, 10), a = ri(2, 6);
    return mk('equations', `x : ${a} = ${x} bo‘lsa, x = ?`, x * a, [x + a, x, x * a + a, x * a - 1], `x = ${x} · ${a} = ${x * a}.`); },
  () => { const x = ri(4, 12), a = ri(2, 4), b = ri(1, 7);
    return mk('equations', `${a}x − ${b} = ${a * x - b} bo‘lsa, x = ?`, x, [a * x, x + b, x - 1, x + 2], `${a}x = ${a * x - b} + ${b} = ${a * x}, x = ${x}.`); },
];

G.percent = [
  () => { const p = pick([10, 20, 25, 50]), N = pick([40, 60, 80, 100, 120, 200, 240, 400]);
    return mk('percent', `${N} ning ${p}% i nechaga teng?`, (N * p) / 100, [p, N / 10, N - (N * p) / 100, (N * p) / 100 + 10], `${N} · ${p} : 100 = ${(N * p) / 100}.`); },
  () => { const p = pick([10, 20, 50]), P = pick([100, 200, 300, 500]);
    return mk('percent', `Narxi ${P} so‘m bo‘lgan mahsulot ${p}% arzonlashdi. Yangi narx qancha?`, P - (P * p) / 100, [(P * p) / 100, P + (P * p) / 100, P - p, P / 2 - 10], `${p}% = ${(P * p) / 100} so‘m. ${P} − ${(P * p) / 100} = ${P - (P * p) / 100}.`, ' so‘m'); },
  () => { const [a, b, r] = pick([[10, 100, 10], [20, 80, 25], [50, 100, 50], [25, 50, 50], [30, 60, 50], [10, 40, 25], [5, 20, 25], [40, 80, 50]]);
    return mk('percent', `${a} soni ${b} ning necha foizi?`, `${r}%`, [`${r + 10}%`, `${Math.max(r - 10, 5)}%`, `${a}%`, `${b}%`], `${a} : ${b} = ${r / 100} = ${r}%.`); },
  () => { const p = pick([10, 20, 50]), P = pick([100, 200, 400, 500]);
    return mk('percent', `${P} so‘mlik narx ${p}% ga oshdi. Yangi narx qancha?`, P + (P * p) / 100, [P - (P * p) / 100, (P * p) / 100, P + p, P * 2], `${p}% = ${(P * p) / 100}. ${P} + ${(P * p) / 100} = ${P + (P * p) / 100}.`, ' so‘m'); },
  () => { const N = pick([20, 30, 40, 50, 60]);
    return mk('percent', `${N} o‘quvchining 50% i qiz bola. Nechta qiz bola bor?`, N / 2, [N / 5, N - 10, N, N / 4], `50% — yarmi: ${N} : 2 = ${N / 2}.`); },
  () => mk('percent', `1% — bu butunning qaysi qismi?`, '1/100', ['1/10', '1/1000', '1/2'], '1% = 1/100 = 0,01.'),
];

G.geometry = [
  () => { const a = ri(2, 15);
    return mk('geometry', `Tomoni ${a} sm bo‘lgan kvadratning yuzi?`, `${a * a} sm²`, [`${a * 4} sm²`, `${a * 2} sm²`, `${a * a + a} sm²`], `Yuz = tomon · tomon = ${a} · ${a} = ${a * a}.`); },
  () => { const a = ri(2, 15);
    return mk('geometry', `Tomoni ${a} sm bo‘lgan kvadratning perimetri?`, `${a * 4} sm`, [`${a * a} sm`, `${a * 2} sm`, `${a * 3} sm`], `Perimetr = 4 · tomon = 4 · ${a} = ${a * 4}.`); },
  () => { const a = ri(3, 12), b = ri(2, a - 1);
    return mk('geometry', `Eni ${b} sm, bo‘yi ${a} sm to‘g‘ri to‘rtburchakning yuzi?`, `${a * b} sm²`, [`${(a + b) * 2} sm²`, `${a + b} sm²`, `${a * b + a} sm²`], `Yuz = bo‘y · en = ${a} · ${b} = ${a * b}.`); },
  () => { const a = ri(3, 12), b = ri(2, a - 1);
    return mk('geometry', `Eni ${b} sm, bo‘yi ${a} sm to‘g‘ri to‘rtburchakning perimetri?`, `${(a + b) * 2} sm`, [`${a * b} sm`, `${a + b} sm`, `${(a + b) * 3} sm`], `Perimetr = 2 · (${a} + ${b}) = ${(a + b) * 2}.`); },
  () => { const x = pick([30, 40, 50, 60, 70, 80]), y = pick([20, 30, 40, 50, 60]);
    return mk('geometry', `Uchburchakning ikki burchagi ${x}° va ${y}°. Uchinchi burchagi?`, `${180 - x - y}°`, [`${90 - x}°`, `${x + y}°`, `${360 - x - y}°`], `Burchaklar yig‘indisi 180°: 180 − ${x} − ${y} = ${180 - x - y}.`); },
  () => { const r = ri(2, 15);
    return mk('geometry', `Aylana radiusi ${r} sm. Diametri nechaga teng?`, `${r * 2} sm`, [`${r} sm`, `${r * 3} sm`, `${r * 4} sm`], `Diametr = 2 · radius = ${r * 2}.`); },
  () => { const b = pick([4, 6, 8, 10, 12]), h = ri(2, 9);
    return mk('geometry', `Asosi ${b} sm, balandligi ${h} sm uchburchakning yuzi?`, `${(b * h) / 2} sm²`, [`${b * h} sm²`, `${b + h} sm²`, `${(b * h) / 2 + b} sm²`], `Yuz = asos · balandlik : 2 = ${b * h} : 2 = ${(b * h) / 2}.`); },
];

G.kinematics = [
  () => { const t = ri(2, 12), v = ri(2, 15), s = v * t;
    return mk('kinematics', `Jism ${s} m yo‘lni ${t} s da bosdi. Tezligi qancha?`, `${v} m/s`, [`${s * t} m/s`, `${s + t} m/s`, `${v + 2} m/s`], `v = s : t = ${s} : ${t} = ${v}.`); },
  () => { const t = ri(2, 10), v = ri(2, 12);
    return mk('kinematics', `Tezligi ${v} m/s bo‘lgan jism ${t} s da qancha yo‘l bosadi?`, `${v * t} m`, [`${v + t} m`, `${num(v / t)} m`, `${v * t + v} m`], `s = v · t = ${v} · ${t} = ${v * t}.`); },
  () => { const v = ri(2, 10), t = ri(2, 10), s = v * t;
    return mk('kinematics', `${s} m yo‘lni ${v} m/s tezlik bilan necha sekundda bosib o‘tadi?`, `${t} s`, [`${s * v} s`, `${s - v} s`, `${t + 2} s`], `t = s : v = ${s} : ${v} = ${t}.`); },
  () => { const [kmh, ms] = pick([[36, 10], [72, 20], [18, 5], [54, 15], [90, 25], [108, 30]]);
    return mk('kinematics', `${kmh} km/soat necha m/s ga teng?`, `${ms} m/s`, [`${kmh} m/s`, `${ms * 2} m/s`, `${ms + 5} m/s`], `km/soat ni 3,6 ga bo‘lamiz: ${kmh} : 3,6 = ${ms}.`); },
  () => { const t = ri(2, 10), a = ri(2, 6), v = a * t;
    return mk('kinematics', `Jism tinch holatdan ${t} s da ${v} m/s tezlikka erishdi. Tezlanishi?`, `${a} m/s²`, [`${v * t} m/s²`, `${v + t} m/s²`, `${a + 2} m/s²`], `a = v : t = ${v} : ${t} = ${a}.`); },
  () => mk('kinematics', 'Tezlik qaysi birlikda o‘lchanadi?', 'm/s', ['kg', 'N', 'Ω'], 'Tezlik metr/sekund (m/s) yoki km/soat bilan o‘lchanadi.'),
];

G.electricity = [
  () => { const R = ri(2, 10), I = ri(2, 9), U = R * I;
    return mk('electricity', `Kuchlanish ${U} V, qarshilik ${R} Ω. Tok kuchi qancha?`, `${I} A`, [`${U * R} A`, `${U + R} A`, `${I + 2} A`], `Om qonuni: I = U : R = ${U} : ${R} = ${I}.`); },
  () => { const R = ri(2, 10), I = ri(2, 9);
    return mk('electricity', `Tok kuchi ${I} A, qarshilik ${R} Ω. Kuchlanish qancha?`, `${I * R} V`, [`${I + R} V`, `${num(I / R)} V`, `${I * R + I} V`], `U = I · R = ${I} · ${R} = ${I * R}.`); },
  () => { const R = ri(2, 10), I = ri(2, 6), U = R * I;
    return mk('electricity', `Kuchlanish ${U} V, tok kuchi ${I} A. Qarshilik qancha?`, `${R} Ω`, [`${U * I} Ω`, `${U + I} Ω`, `${R + 3} Ω`], `R = U : I = ${U} : ${I} = ${R}.`); },
  () => { const a = ri(1, 9), b = ri(1, 9);
    return mk('electricity', `Ketma-ket ulangan ${a} Ω va ${b} Ω qarshiliklarning umumiy qarshiligi?`, `${a + b} Ω`, [`${a * b} Ω`, `${Math.abs(a - b) + 1} Ω`, `${a + b + 2} Ω`], `Ketma-ket ulanishda qarshiliklar qo‘shiladi: ${a} + ${b} = ${a + b}.`); },
  () => { const U = pick([6, 12, 24, 220]), I = ri(2, 5);
    return mk('electricity', `Kuchlanish ${U} V, tok kuchi ${I} A. Quvvat qancha?`, `${U * I} W`, [`${U + I} W`, `${num(U / I)} W`, `${U * I + U} W`], `P = U · I = ${U} · ${I} = ${U * I}.`); },
  () => mk('electricity', 'Kuchlanish qaysi birlikda o‘lchanadi?', 'Volt', ['Amper', 'Om', 'Vatt'], 'Kuchlanish voltda (V) o‘lchanadi.'),
];

export function generateAll(perTopic = 20) {
  const out = [];
  Object.entries(G).forEach(([topic, gens]) => {
    const seen = new Set(); let tries = 0, n = 0;
    while (n < perTopic && tries++ < 3000) {
      const item = pick(gens)();
      if (!item || seen.has(item.q)) continue;
      seen.add(item.q);
      out.push({ ...item, id: `${topic}-g${++n}` });
    }
  });
  return out;
}
