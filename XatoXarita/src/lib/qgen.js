// Matematika va fizika uchun murakkab savollar generatori.
// Har bir yuklanishda parametrlar yangidan tanlanadi, to'g'ri javob esa hisoblab topiladi.
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[ri(0, arr.length - 1)];
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const lcm = (a, b) => (a * b) / gcd(a, b);
const num = (x) => String(Math.round(x * 100) / 100).replace('.', ',').replace('-', '−');
const fr = (n, d) => {
  const g = gcd(n, d) || 1;
  n /= g; d /= g;
  if (d < 0) { n = -n; d = -d; }
  return d === 1 ? num(n) : `${num(n)}/${d}`;
};
const mixed = (n, d) => {
  const g = gcd(n, d) || 1;
  n /= g; d /= g;
  if (d === 1) return String(n);
  const w = Math.floor(n / d), r = n - w * d;
  return w ? `${w} ${r}/${d}` : `${r}/${d}`;
};
const lin = (a, b) => `${a === 1 ? '' : a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}`;

// to'g'ri javob + noto'g'ri variantlar -> savol obyekti (to'g'ri javob 0-o'rinda; test paytida aralashtiriladi)
function mk(topic, text, correct, wrongs, e) {
  const f = (v) => (typeof v === 'number' ? num(v) : String(v));
  correct = f(correct);
  const set = [];
  wrongs.map(f).forEach((w) => { if (w !== correct && !set.includes(w)) set.push(w); });
  const n = parseFloat(correct.replace(',', '.').replace('−', '-'));
  if (set.length < 3 && /^[−-]?\d+([.,]\d+)?$/.test(correct) && !Number.isNaN(n)) {
    for (const d of [1, -1, 2, -2, 10, -10, 5, -5]) {
      const w = num(n + d);
      if (w !== correct && !set.includes(w)) set.push(w);
      if (set.length >= 3) break;
    }
  }
  if (set.length < 3) return null;
  return { topic, q: text, options: [correct, ...set.slice(0, 3)], a: 0, e };
}

const G = {};

// ---------- KASRLAR ----------
G.fractions = [
  () => {
    const b = ri(2, 12), d = ri(2, 12); if (b === d) return null;
    const a = ri(1, b - 1), c = ri(1, d - 1);
    const N = a * d + c * b, D = b * d;
    return mk('fractions', `${a}/${b} + ${c}/${d} = ?`, fr(N, D),
      [fr(a + c, b + d), `${N}/${D}`, fr(a * c, b * d), fr(Math.abs(a * d - c * b), D), fr(N + 1, D)],
      `Umumiy maxraj ${b * d}: ${a * d}/${D} + ${c * b}/${D} = ${N}/${D}${fr(N, D) !== `${N}/${D}` ? ' = ' + fr(N, D) : ''}. Maxrajlar qo‘shilmaydi.`);
  },
  () => {
    const b = ri(2, 12), d = ri(2, 12); if (b === d) return null;
    let a = ri(1, 11), c = ri(1, 11);
    if (a * d <= c * b) [a, c] = [c, a];
    if (a * d <= c * b) return null;
    const N = a * d - c * b, D = b * d;
    return mk('fractions', `${a}/${b} − ${c}/${d} = ?`, fr(N, D),
      [fr(a - c, Math.abs(b - d)), fr(a * d + c * b, D), fr(a * c, b * d), fr(N + 1, D)],
      `Umumiy maxraj ${D}: (${a * d} − ${c * b})/${D} = ${fr(N, D)}.`);
  },
  () => {
    const a = ri(1, 9), b = ri(2, 10), c = ri(1, 9), d = ri(2, 10);
    return mk('fractions', `${a}/${b} · ${c}/${d} = ?`, fr(a * c, b * d),
      [fr(a * d, b * c), fr(a + c, b + d), fr(a * c, b + d), fr(a * d + c * b, b * d)],
      `Kasrlar ko‘paytirilganda suratlar suratga, maxrajlar maxrajga ko‘paytiriladi: ${a * c}/${b * d}.`);
  },
  () => {
    const a = ri(1, 9), b = ri(2, 10), c = ri(1, 9), d = ri(2, 10);
    return mk('fractions', `${a}/${b} : ${c}/${d} = ?`, fr(a * d, b * c),
      [fr(a * c, b * d), fr(b * c, a * d), fr(a * d, b + c), fr(a * d + 1, b * c)],
      `Bo‘lish — ikkinchi kasrni ag‘darib ko‘paytirish: ${a}/${b} · ${d}/${c} = ${fr(a * d, b * c)}.`);
  },
  () => {
    const w1 = ri(1, 4), w2 = ri(1, 4), b = pick([2, 3, 4, 5, 6]), d = pick([2, 3, 4, 5, 6]); if (b === d) return null;
    const a = ri(1, b - 1), c = ri(1, d - 1);
    const N = (w1 * b + a) * d + (w2 * d + c) * b, D = b * d;
    return mk('fractions', `${w1} ${a}/${b} + ${w2} ${c}/${d} = ?`, mixed(N, D),
      [mixed(N + 1, D), mixed(N - 1, D), mixed(N + D, D), mixed(N - D > 0 ? N - D : N + 2 * D, D)],
      `Aralash sonlarni noto‘g‘ri kasrga aylantirib qo‘shamiz: ${w1 * b + a}/${b} + ${w2 * d + c}/${d} = ${N}/${D} = ${mixed(N, D)}.`);
  },
  () => {
    const a = ri(2, 7), b = ri(a + 1, 9), k = ri(2, 12);
    const x = b * k, part = a * k;
    return mk('fractions', `Sonning ${a}/${b} qismi ${part} ga teng. Shu sonni toping.`, x,
      [part * a / b, x + a, part * b, x - b],
      `Butunni topish uchun qismni kasrga bo‘lamiz: ${part} : ${a}/${b} = ${part} · ${b}/${a} = ${x}.`);
  },
  () => {
    const set = new Set(); const arr = [];
    for (let t = 0; t < 40 && arr.length < 4; t++) {
      const b = ri(3, 12), a = ri(1, b - 1), v = a / b;
      if (!set.has(v.toFixed(5))) { set.add(v.toFixed(5)); arr.push([a, b, v]); }
    }
    if (arr.length < 4) return null;
    const max = arr.reduce((m, x) => (x[2] > m[2] ? x : m));
    return mk('fractions', 'Quyidagi kasrlardan qaysi biri eng katta?', `${max[0]}/${max[1]}`,
      arr.filter((x) => x !== max).map((x) => `${x[0]}/${x[1]}`),
      `Kasrlarni o‘nli kasrga aylantirib solishtiramiz: ${arr.map((x) => `${x[0]}/${x[1]} ≈ ${num(x[2])}`).join(', ')}.`);
  },
  () => {
    const b = pick([2, 3, 4, 5, 6, 8]), a = ri(1, b - 1), n = ri(2, 6) * b;
    const rest = n - (n * a) / b;
    return mk('fractions', `Kitobning ${a}/${b} qismi o‘qildi. Agar kitob ${n} betdan iborat bo‘lsa, nechta bet o‘qilmagan?`, rest,
      [(n * a) / b, n - a, n / b, n * (b - a)],
      `O‘qilgani ${n} · ${a}/${b} = ${(n * a) / b} bet, o‘qilmagani ${n} − ${(n * a) / b} = ${rest}.`);
  },
];

// ---------- TENGLAMALAR ----------
G.equations = [
  () => {
    const x = ri(-6, 9), a = ri(2, 9), c = ri(1, a - 1), b = ri(-9, 9);
    const d = (a - c) * x + b;
    return mk('equations', `${lin(a, b)} = ${c === 1 ? '' : c}x ${d < 0 ? '−' : '+'} ${Math.abs(d)} tenglamani yeching.`, num(x),
      [num((d + b) / (a - c)), num((d - b) / (a + c)), num(-x), num((b - d) / (a - c) + 0)],
      `Noma’lumlarni bir tomonga o‘tkazamiz: ${a - c}x = ${d - b}, demak x = ${num(x)}.`);
  },
  () => {
    const x = ri(-5, 8), a = ri(2, 6), b = ri(1, 7), k = ri(1, 12);
    const m = a * (x + b) - k;
    return mk('equations', `${a}(x + ${b}) − ${k} = ${m} bo‘lsa, x = ?`, num(x),
      [num((m + k) / a + b), num((m + k) / a), num((m - k) / a - b), num(x + 1)],
      `${a}(x + ${b}) = ${m + k}, x + ${b} = ${(m + k) / a}, x = ${num(x)}.`);
  },
  () => {
    const p = ri(-7, 8), q = ri(-7, 8); if (p === q || p === -q || !p || !q) return null;
    const B = -(p + q), C = p * q;
    const fm = (v) => num(v);
    return mk('equations', `x² ${B < 0 ? '−' : '+'} ${Math.abs(B) === 1 ? '' : Math.abs(B)}${B ? 'x ' : ''}${C < 0 ? '−' : '+'} ${Math.abs(C)} = 0 tenglamaning ildizlari qaysi?`,
      `${fm(Math.min(p, q))} va ${fm(Math.max(p, q))}`,
      [`${fm(-p)} va ${fm(-q)}`.split(' va ').sort().join(' va '), `${fm(p)} va ${fm(-q)}`, `${fm(-p)} va ${fm(q)}`],
      `Viyet teoremasi: ildizlar yig‘indisi ${p + q}, ko‘paytmasi ${C}. Bunday sonlar ${p} va ${q}.`);
  },
  () => {
    const p = ri(-6, 8), q = ri(-6, 8); if (p === q || !p || !q) return null;
    const B = -(p + q), C = p * q;
    if (!B) return null;
    return mk('equations', `x² ${B < 0 ? '−' : '+'} ${Math.abs(B) === 1 ? '' : Math.abs(B)}x ${C < 0 ? '−' : '+'} ${Math.abs(C)} = 0 tenglama ildizlarining ko‘paytmasi nechaga teng?`, num(C),
      [num(-C), num(p + q), num(-(p + q)), num(C + 1)],
      `Viyet teoremasi: x² + bx + c = 0 da ildizlar ko‘paytmasi c ga teng, ya’ni ${C}.`);
  },
  () => {
    const x = ri(1, 9), y = ri(1, 9), A = 2 * x + y, B = x - y;
    return mk('equations', `{ 2x + y = ${A}; x − y = ${B < 0 ? '−' + Math.abs(B) : B} } sistemadan x · y ni toping.`, num(x * y),
      [num(x + y), num(Math.abs(x - y)), num(x * y + x), num(2 * x * y)],
      `Tenglamalarni qo‘shamiz: 3x = ${A + B}, x = ${x}. Keyin y = ${y}. x · y = ${x * y}.`);
  },
  () => {
    const L = ri(3, 30), S = ri(10, 60) * 2, D = ri(1, 9) * 2; if (D >= S) return null;
    return mk('equations', `Ikki sonning yig‘indisi ${S}, ayirmasi ${D}. Katta sonni toping.`, (S + D) / 2,
      [(S - D) / 2, S - D, S / 2 + D, (S + D) / 2 + 1],
      `Katta son = (yig‘indi + ayirma) : 2 = (${S} + ${D}) : 2 = ${(S + D) / 2}.`);
  },
  () => {
    const a = ri(2, 7), b = ri(-9, 12), c = ri(-5, 20);
    const v = (c - b) / a, ans = Math.floor(v) + 1;
    return mk('equations', `${lin(a, b)} > ${c} tengsizlikning eng kichik butun yechimi nechaga teng?`, ans,
      [Math.floor(v), Math.ceil(v) === ans ? ans + 1 : Math.ceil(v), ans + 1, Math.floor(v) - 1],
      `${a}x > ${c - b}, x > ${num(v)}. Qat’iy tengsizlik, shuning uchun eng kichik butun yechim ${ans}.`);
  },
  () => {
    const b = ri(-9, 9), c = ri(-12, 9), D = b * b - 4 * c;
    return mk('equations', `x² ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}${b ? 'x ' : ''}${c < 0 ? '−' : '+'} ${Math.abs(c)} = 0 tenglamaning diskriminanti nechaga teng?`, D,
      [b * b + 4 * c, b * b - 2 * c, 4 * c - b * b, D + 4],
      `D = b² − 4ac = ${b * b} − 4 · ${c < 0 ? '(' + num(c) + ')' : c} = ${num(D)}.`);
  },
];

// ---------- FOIZLAR ----------
G.percent = [
  () => {
    const P = ri(1, 10) * 400, a = pick([10, 20, 30, 40, 50, 60]), b = pick([10, 20, 30, 40, 50]);
    const r = (P * (100 + a) * (100 - b)) / 10000;
    return mk('percent', `Mahsulot narxi ${P} so‘m edi. Avval ${a}% ga oshirildi, keyin ${b}% ga arzonlashtirildi. Oxirgi narx qancha?`, r,
      [P * (100 + a - b) / 100, P, (P * (100 + a)) / 100, (P * (100 - b)) / 100],
      `${P} · ${(100 + a) / 100} = ${(P * (100 + a)) / 100}, keyin · ${(100 - b) / 100} = ${r}. Foizlar bir-biriga qo‘shilmaydi.`);
  },
  () => {
    const P = ri(5, 50) * 20, d = pick([10, 20, 25, 30, 40, 50]);
    const X = (P * (100 - d)) / 100;
    return mk('percent', `Chegirmadan keyin kitob narxi ${X} so‘m bo‘ldi. Chegirma ${d}% bo‘lgan bo‘lsa, dastlabki narx qancha edi?`, P,
      [num((X * (100 + d)) / 100), X + d, num((X * 100) / (100 + d)), X + (X * d) / 100 + d],
      `Chegirmadan keyin narx dastlabkining ${100 - d}% i: ${X} : ${(100 - d) / 100} = ${P}.`);
  },
  () => {
    const a = ri(2, 30) * 20, ch = pick([-50, -25, -20, -10, 10, 20, 25, 50, 60, 75]), b = (a * (100 + ch)) / 100;
    const word = ch > 0 ? 'oshdi' : 'kamaydi';
    const ans = `${Math.abs(ch)}% ga ${word}`;
    const rel = num((Math.abs(b - a) / b) * 100);
    return mk('percent', `Ko‘rsatkich ${a} dan ${num(b)} ga o‘zgardi. Bu necha foizga o‘zgargan?`, ans,
      [`${rel}% ga ${word}`, `${Math.abs(ch)}% ga ${ch > 0 ? 'kamaydi' : 'oshdi'}`, `${num(Math.abs(b - a))}% ga ${word}`],
      `O‘zgarish dastlabki qiymatga nisbatan olinadi: (${num(b)} − ${a}) / ${a} · 100% = ${ch > 0 ? '+' : '−'}${Math.abs(ch)}%.`);
  },
  () => {
    const total = pick([100, 200, 250, 400, 500]), p = ri(4, 40), X = (total * p) / 100;
    if (!Number.isInteger(X)) return null;
    return mk('percent', `${X} g tuzni ${total - X} g suvda eritildi. Eritmaning tuz bo‘yicha konsentratsiyasi necha foiz?`, `${p}%`,
      [`${num((X / (total - X)) * 100)}%`, `${num(100 - p)}%`, `${num(p + 5)}%`, `${num(p * 2)}%`],
      `Eritma massasi ${total} g. Konsentratsiya = ${X} / ${total} · 100% = ${p}%. Suv massasiga emas, eritma massasiga bo‘linadi.`);
  },
  () => {
    const P = ri(1, 10) * 400, r = pick([5, 10, 20, 25]);
    const A = P * (1 + r / 100) ** 2;
    if (!Number.isInteger(Math.round(A * 100) / 100)) return null;
    return mk('percent', `Bankka ${P} so‘m yillik ${r}% murakkab foiz bilan qo‘yildi. 2 yildan keyin hisobdagi summa qancha bo‘ladi?`, num(A),
      [num(P * (1 + (2 * r) / 100)), num(P * (1 + r / 100)), num(P * (1 + r / 100) ** 2 + P * r / 100), num(P * (1 + r / 50) ** 2)],
      `Murakkab foizda har yili yangi summaga foiz qo‘shiladi: ${P} · ${(1 + r / 100)}² = ${num(A)}.`);
  },
  () => {
    const b = ri(2, 25) * 20, ch = pick([10, 20, 25, 30, 40, 50, 60]), a = (b * (100 + ch)) / 100;
    return mk('percent', `${num(a)} soni ${b} dan necha foiz ko‘p?`, `${ch}%`,
      [`${num(((a - b) / a) * 100)}%`, `${num(a - b)}%`, `${100 + ch}%`, `${num(ch / 2)}%`],
      `Solishtirilayotgan son (${b}) 100% deb olinadi: (${num(a)} − ${b}) / ${b} · 100% = ${ch}%.`);
  },
  () => {
    const n = ri(2, 8) * 25, g = pick([20, 30, 40, 60]), m = (n * g) / 100;
    if (!Number.isInteger(m)) return null;
    const rest = n - m, pb = pick([25, 50]);
    const ans = (rest * pb) / 100;
    if (!Number.isInteger(ans)) return null;
    return mk('percent', `Sinfda ${n} o‘quvchi bor. Ularning ${g}% i qizlar. O‘g‘il bolalarning ${pb}% i sportchi. Nechta o‘g‘il bola sportchi?`, ans,
      [(n * pb) / 100, m * pb / 100, rest, (n * (100 - pb)) / 100],
      `O‘g‘il bolalar ${n} − ${m} = ${rest} ta. Ularning ${pb}% i: ${rest} · ${pb / 100} = ${ans}.`);
  },
];

// ---------- GEOMETRIYA ----------
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
G.geometry = [
  () => {
    const [a, b, c] = pick(TRIPLES), k = ri(1, 4), hyp = ri(0, 1);
    if (hyp) return mk('geometry', `To‘g‘ri burchakli uchburchakning katetlari ${a * k} sm va ${b * k} sm. Gipotenuzasi necha sm?`, c * k,
      [a * k + b * k, (a * k) ** 2 + (b * k) ** 2, Math.abs(b - a) * k, c * k + 1],
      `Pifagor teoremasi: c² = ${(a * k) ** 2} + ${(b * k) ** 2} = ${(c * k) ** 2}, c = ${c * k}.`);
    return mk('geometry', `To‘g‘ri burchakli uchburchakning gipotenuzasi ${c * k} sm, kateti ${a * k} sm. Ikkinchi katetini toping.`, b * k,
      [c * k - a * k, Math.round(Math.sqrt((c * k) ** 2 + (a * k) ** 2) * 100) / 100, (c * k) ** 2 - (a * k) ** 2, b * k + 1],
      `b² = c² − a² = ${(c * k) ** 2} − ${(a * k) ** 2} = ${(b * k) ** 2}, b = ${b * k}.`);
  },
  () => {
    const r = ri(2, 15);
    if (ri(0, 1)) return mk('geometry', `Radiusi ${r} sm bo‘lgan doiraning yuzi qancha?`, `${r * r}π sm²`,
      [`${2 * r}π sm²`, `${4 * r * r}π sm²`, `${2 * r * r}π sm²`], `S = πr² = π · ${r}² = ${r * r}π.`);
    return mk('geometry', `Doira yuzi ${r * r}π sm². Aylana uzunligi qancha?`, `${2 * r}π sm`,
      [`${r}π sm`, `${r * r}π sm`, `${4 * r}π sm`], `r² = ${r * r}, r = ${r}. C = 2πr = ${2 * r}π.`);
  },
  () => {
    const n = pick([5, 6, 8, 9, 10, 12, 15]), ang = ((n - 2) * 180) / n;
    if (!Number.isInteger(ang)) return null;
    return mk('geometry', `Muntazam ${n} burchakning bitta ichki burchagi necha gradus?`, `${ang}°`,
      [`${(n - 2) * 180}°`, `${360 / n}°`, `${ang + 10}°`, `${180 - 360 / n + 12}°`],
      `Ichki burchaklar yig‘indisi (${n} − 2) · 180° = ${(n - 2) * 180}°. Bittasi ${(n - 2) * 180}° : ${n} = ${ang}°.`);
  },
  () => {
    const a = ri(4, 14), b = ri(a + 1, 20), h = ri(2, 12), S = ((a + b) * h) / 2;
    return mk('geometry', `Trapetsiyaning asoslari ${a} sm va ${b} sm, balandligi ${h} sm. Yuzi qancha?`, `${num(S)} sm²`,
      [`${num((a + b) * h)} sm²`, `${num(a * b)} sm²`, `${num((a * h + b * h) / 4)} sm²`, `${num(S + h)} sm²`],
      `S = (a + b)/2 · h = (${a} + ${b})/2 · ${h} = ${num(S)}.`);
  },
  () => {
    const a = ri(2, 9), V = a ** 3;
    return mk('geometry', `Kubning hajmi ${V} sm³. Uning to‘la sirti qancha?`, `${6 * a * a} sm²`,
      [`${4 * a * a} sm²`, `${a * a} sm²`, `${6 * a} sm²`, `${3 * a * a} sm²`],
      `Qirrasi a = ∛${V} = ${a}. To‘la sirt = 6a² = 6 · ${a * a} = ${6 * a * a}.`);
  },
  () => {
    const x = ri(30, 80), y = ri(30, 90); if (x + y >= 170) return null;
    return mk('geometry', `Uchburchakning ikki burchagi ${x}° va ${y}°. Uchinchi burchakka qo‘shni (tashqi) burchak necha gradus?`, `${x + y}°`,
      [`${180 - x - y}°`, `${180 - x}°`, `${360 - x - y}°`, `${x + y + 10}°`],
      `Tashqi burchak o‘ziga qo‘shni bo‘lmagan ikki ichki burchak yig‘indisiga teng: ${x}° + ${y}° = ${x + y}°.`);
  },
  () => {
    const [a, b, c] = pick(TRIPLES.slice(0, 3)), k = ri(1, 4);
    const d1 = 2 * a * k, d2 = 2 * b * k;
    return mk('geometry', `Rombning diagonallari ${d1} sm va ${d2} sm. Rombning tomoni necha sm?`, c * k,
      [a * k + b * k, (d1 + d2) / 2, c * k + k, d1 * d2 / 2],
      `Diagonallar o‘zaro perpendikulyar va teng bo‘linadi: tomon² = ${a * k}² + ${b * k}² = ${(c * k) ** 2}, tomon = ${c * k}.`);
  },
  () => {
    const k = ri(2, 5), S = ri(2, 12);
    return mk('geometry', `Ikki o‘xshash uchburchakning o‘xshashlik koeffitsienti ${k}. Kichigining yuzi ${S} sm² bo‘lsa, kattasining yuzi qancha?`, `${S * k * k} sm²`,
      [`${S * k} sm²`, `${S * 2 * k} sm²`, `${S + k} sm²`, `${S * k * k * k} sm²`],
      `Yuzlar nisbati o‘xshashlik koeffitsientining kvadratiga teng: ${S} · ${k}² = ${S * k * k}.`);
  },
  () => {
    const c = ri(10, 80) * 2;
    return mk('geometry', `Aylanada markaziy burchak ${c}° bo‘lgan yoyga tiralgan ichki burchak necha gradus?`, `${c / 2}°`,
      [`${c}°`, `${c * 2}°`, `${180 - c / 2}°`, `${c / 2 + 10}°`],
      `Ichki burchak o‘sha yoyga tiralgan markaziy burchakning yarmiga teng: ${c}° : 2 = ${c / 2}°.`);
  },
];

// ---------- KINEMATIKA ----------
const PAIRS = [[40, 60], [30, 60], [20, 30], [60, 90], [50, 75], [10, 15], [45, 90], [15, 30], [30, 45]];
G.kinematics = [
  () => {
    const [v1, v2] = pick(PAIRS), v = (2 * v1 * v2) / (v1 + v2);
    return mk('kinematics', `Jism yo‘lning birinchi yarmini ${v1} km/soat, ikkinchi yarmini ${v2} km/soat tezlik bilan bosdi. O‘rtacha tezligi qancha?`, `${num(v)} km/soat`,
      [`${num((v1 + v2) / 2)} km/soat`, `${num(Math.sqrt(v1 * v2))} km/soat`, `${num(v + 5)} km/soat`, `${num(v1 + v2)} km/soat`],
      `O‘rtacha tezlik = butun yo‘l / butun vaqt = 2v₁v₂/(v₁+v₂) = ${num(v)} km/soat. Tezliklarning o‘rtacha arifmetigi emas.`);
  },
  () => {
    const v0 = ri(2, 10), a = ri(1, 6), t = ri(2, 8), s = v0 * t + (a * t * t) / 2;
    return mk('kinematics', `Jism ${v0} m/s boshlang‘ich tezlik va ${a} m/s² tezlanish bilan tekis tezlanuvchan harakat qilmoqda. ${t} s da qancha yo‘l bosadi?`, `${num(s)} m`,
      [`${num(v0 * t + a * t * t)} m`, `${num(v0 * t)} m`, `${num((a * t * t) / 2)} m`, `${num((v0 + a * t) * t)} m`],
      `s = v₀t + at²/2 = ${v0 * t} + ${num((a * t * t) / 2)} = ${num(s)} m.`);
  },
  () => {
    const t = ri(1, 6), h = 5 * t * t;
    return mk('kinematics', `Jism ${h} m balandlikdan erkin tushmoqda (g = 10 m/s², qarshilik hisobga olinmaydi). Yerga necha sekundda tushadi?`, `${t} s`,
      [`${num(h / 10)} s`, `${num(Math.sqrt(h))} s`, `${t + 1} s`, `${num(h / 5)} s`],
      `h = gt²/2 dan t = √(2h/g) = √(${2 * h}/10) = ${t} s.`);
  },
  () => {
    const v1 = ri(2, 12), v2 = ri(2, 12), t = ri(2, 9);
    if (ri(0, 1)) { const L = (v1 + v2) * t;
      return mk('kinematics', `Ikki jism bir-biriga qarab harakatlanmoqda, tezliklari ${v1} m/s va ${v2} m/s. Oralaridagi masofa ${L} m. Necha sekunddan keyin uchrashadi?`, `${t} s`,
        [`${num(L / v1)} s`, `${num(L / Math.abs(v1 - v2 || 1))} s`, `${t + 2} s`, `${num(L / Math.max(v1, v2))} s`],
        `Yaqinlashish tezligi ${v1} + ${v2} = ${v1 + v2} m/s. t = ${L} / ${v1 + v2} = ${t} s.`);
    }
    if (v1 === v2) return null;
    const hi = Math.max(v1, v2), lo = Math.min(v1, v2), L = (hi - lo) * t;
    return mk('kinematics', `Oldinda ketayotgan jism tezligi ${lo} m/s, orqasidan quvayotgani ${hi} m/s. Oralaridagi masofa ${L} m. Necha sekundda yetib oladi?`, `${t} s`,
      [`${num(L / (hi + lo))} s`, `${num(L / hi)} s`, `${t + 2} s`, `${num(L / lo)} s`],
      `Quvishda yaqinlashish tezligi ${hi} − ${lo} = ${hi - lo} m/s. t = ${L} / ${hi - lo} = ${t} s.`);
  },
  () => {
    const a = ri(1, 5), k = ri(1, 4), v0 = 2 * a * k, s = (v0 * v0) / (2 * a);
    return mk('kinematics', `Avtomobil ${v0} m/s tezlik bilan harakatlanib, ${a} m/s² tezlanish bilan tormozlana boshladi. To‘xtaguncha qancha yo‘l bosadi?`, `${s} m`,
      [`${num(v0 * v0 / a)} m`, `${num(v0 / a)} m`, `${num(v0 * a)} m`, `${s + a} m`],
      `v² = v₀² − 2as, v = 0 bo‘lsa s = v₀²/(2a) = ${v0 * v0}/${2 * a} = ${s} m.`);
  },
  () => {
    const v = ri(2, 5) * 2, t1 = ri(2, 6), t2 = ri(2, 8), s = (v * t1) / 2 + v * t2;
    return mk('kinematics', `Jism tinch holatdan ${t1} s davomida tekis tezlanib ${v} m/s tezlikka erishdi, so‘ng ${t2} s shu tezlikda tekis harakat qildi. Jami yo‘l qancha?`, `${num(s)} m`,
      [`${num(v * (t1 + t2))} m`, `${num(v * t1 + v * t2 / 2)} m`, `${num(v * t2)} m`, `${num(s + v)} m`],
      `Tezlanish bosqichida s₁ = vt₁/2 = ${(v * t1) / 2} m, tekis bosqichda s₂ = vt₂ = ${v * t2} m. Jami ${num(s)} m.`);
  },
  () => {
    const kmh = pick([36, 54, 72, 90]), v = kmh / 3.6, t = ri(5, 25), tot = v * t;
    const L = ri(5, Math.floor(tot / 10)) * 10; if (L >= tot - 10) return null;
    const B = tot - L;
    return mk('kinematics', `Uzunligi ${L} m bo‘lgan poyezd ${kmh} km/soat tezlik bilan uzunligi ${B} m ko‘prikdan to‘liq o‘tishi uchun necha sekund kerak?`, `${t} s`,
      [`${num(B / v)} s`, `${num(L / v)} s`, `${num(tot / kmh)} s`, `${t + 5} s`],
      `${kmh} km/soat = ${v} m/s. Poyezd ${L} + ${B} = ${tot} m yo‘l bosadi: t = ${tot}/${v} = ${t} s.`);
  },
];

// ---------- ELEKTR TOKI ----------
const RP = [[3, 6], [6, 12], [4, 12], [12, 24], [10, 40], [20, 30], [15, 30], [30, 60], [5, 20]];
G.electricity = [
  () => {
    const [r1, r2] = pick(RP), R = (r1 * r2) / (r1 + r2);
    return mk('electricity', `${r1} Ω va ${r2} Ω qarshiliklar parallel ulangan. Umumiy qarshilik qancha?`, `${num(R)} Ω`,
      [`${r1 + r2} Ω`, `${num((r1 + r2) / 2)} Ω`, `${r1 * r2} Ω`, `${num(R + 1)} Ω`],
      `1/R = 1/${r1} + 1/${r2}, R = ${r1}·${r2}/(${r1}+${r2}) = ${num(R)} Ω. Parallel ulanishda umumiy qarshilik eng kichik qarshilikdan ham kichik.`);
  },
  () => {
    const [r2, r3] = pick(RP), r1 = ri(2, 10), P = (r2 * r3) / (r2 + r3), R = r1 + P;
    return mk('electricity', `${r1} Ω qarshilik ${r2} Ω va ${r3} Ω parallel ulangan qarshiliklar bilan ketma-ket ulangan. Zanjirning umumiy qarshiligi qancha?`, `${num(R)} Ω`,
      [`${r1 + r2 + r3} Ω`, `${num(P)} Ω`, `${num(R + 2)} Ω`, `${num((r1 * (r2 + r3)) / (r1 + r2 + r3))} Ω`],
      `Parallel qismi ${num(P)} Ω, ketma-ket qo‘shamiz: ${r1} + ${num(P)} = ${num(R)} Ω.`);
  },
  () => {
    const [U, P] = pick([[220, 100], [220, 40], [220, 55], [220, 110], [220, 22], [110, 25], [12, 6], [12, 24], [36, 18], [24, 48]]);
    const R = (U * U) / P;
    return mk('electricity', `Lampochka ${U} V kuchlanishga mo‘ljallangan, quvvati ${P} W. Uning qarshiligi qancha?`, `${num(R)} Ω`,
      [`${num(U / P)} Ω`, `${num(P / U)} Ω`, `${num(U * P)} Ω`, `${num(R / 2)} Ω`],
      `P = U²/R dan R = U²/P = ${U * U}/${P} = ${num(R)} Ω.`);
  },
  () => {
    const I = ri(1, 6), R = ri(2, 30), t = ri(5, 60), Q = I * I * R * t;
    return mk('electricity', `Qarshiligi ${R} Ω bo‘lgan o‘tkazgichdan ${I} A tok ${t} s davomida o‘tdi. Ajralgan issiqlik miqdori qancha?`, `${Q} J`,
      [`${I * R * t} J`, `${I * I * R} J`, `${I * R * R * t} J`, `${Q + I * t} J`],
      `Joul–Lens qonuni: Q = I²Rt = ${I * I} · ${R} · ${t} = ${Q} J.`);
  },
  () => {
    const R1 = ri(2, 12), R2 = ri(2, 12), I = ri(1, 6), U = I * (R1 + R2);
    return mk('electricity', `Ketma-ket ulangan ${R1} Ω va ${R2} Ω qarshiliklarga ${U} V kuchlanish berilgan. ${R2} Ω li qarshilikdagi kuchlanish qancha?`, `${I * R2} V`,
      [`${I * R1} V`, `${U} V`, `${num(U / R2)} V`, `${I * R2 + I} V`],
      `Tok I = U/(R₁+R₂) = ${U}/${R1 + R2} = ${I} A. U₂ = I · R₂ = ${I * R2} V.`);
  },
  () => {
    const [R1, R2] = pick(RP), k = ri(1, 4), U = k * lcm(R1, R2), I = U / R1 + U / R2;
    return mk('electricity', `${R1} Ω va ${R2} Ω qarshiliklar parallel ulanib, ${U} V manbaga ulangan. Asosiy zanjirdagi tok kuchi qancha?`, `${num(I)} A`,
      [`${num(U / (R1 + R2))} A`, `${num(U / R1)} A`, `${num(U / R2)} A`, `${num(I + 1)} A`],
      `Har bir shoxobchada I₁ = ${U}/${R1} = ${num(U / R1)} A, I₂ = ${U}/${R2} = ${num(U / R2)} A. Asosiy tok ularning yig‘indisi: ${num(I)} A.`);
  },
  () => {
    const I = ri(1, 6), R = ri(2, 15), r = ri(1, 5), E = I * (R + r);
    return mk('electricity', `EYuK ${E} V, ichki qarshiligi ${r} Ω bo‘lgan manbaga ${R} Ω qarshilik ulandi. Zanjirdagi tok kuchi qancha?`, `${I} A`,
      [`${num(E / R)} A`, `${num(E / r)} A`, `${num(E / (R - r || 1))} A`, `${I + 1} A`],
      `To‘liq zanjir uchun Om qonuni: I = E/(R + r) = ${E}/${R + r} = ${I} A.`);
  },
];

export function generateAll(perTopic = 36) {
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
