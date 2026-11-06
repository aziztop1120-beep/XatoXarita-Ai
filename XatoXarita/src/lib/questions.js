import { generateAll } from './qgen.js';
import { FRONT_EXTRA, BACKEND_SIMPLE } from './simpleBank.js';
import { UZ_QUESTIONS } from './uzQuestions.js';

// Savollar banki. Matematika/fizika savollari generator orqali (har mavzuda 36 ta, har yuklanishda yangi parametrlar bilan),
// Frontend, Backend va ona tili savollari qo‘lda yozilgan. (Eski izoh:) Savol matnlari o‘zbek tilida; interfeys va AI izohlari 3 tilda.
export const SUBJECTS = {
  math: { uz: 'Matematika', ru: 'Математика', en: 'Mathematics' },
  physics: { uz: 'Fizika', ru: 'Физика', en: 'Physics' },
  uzbek: { uz: 'Ona tili', ru: 'Родной язык', en: 'Native language' },
  frontend: { uz: 'Frontend', ru: 'Frontend', en: 'Frontend' },
  backend: { uz: 'Backend', ru: 'Backend', en: 'Backend' },
};

// Eski natijalarda fan kaliti 'it' bo‘lgan; yangi nomi — 'frontend'.
const LEGACY_SUBJECTS = { it: 'frontend' };
export const normSubject = (k) => LEGACY_SUBJECTS[k] || k;

export const TOPICS = {
  fractions: { subject: 'math', grades: [5, 7], name: { uz: 'Kasrlar', ru: 'Дроби', en: 'Fractions' } },
  equations: { subject: 'math', grades: [6, 9], name: { uz: 'Tenglamalar', ru: 'Уравнения', en: 'Equations' } },
  percent: { subject: 'math', grades: [5, 8], name: { uz: 'Foizlar', ru: 'Проценты', en: 'Percentages' } },
  geometry: { subject: 'math', grades: [7, 11], name: { uz: 'Geometriya', ru: 'Геометрия', en: 'Geometry' } },
  kinematics: { subject: 'physics', grades: [7, 11], name: { uz: 'Kinematika', ru: 'Кинематика', en: 'Kinematics' } },
  electricity: { subject: 'physics', grades: [8, 11], name: { uz: 'Elektr toki', ru: 'Электрический ток', en: 'Electric current' } },
  spelling: { subject: 'uzbek', grades: [5, 11], name: { uz: 'Imlo', ru: 'Орфография', en: 'Spelling' } },
  speech: { subject: 'uzbek', grades: [5, 9], name: { uz: 'So‘z turkumlari', ru: 'Части речи', en: 'Parts of speech' } },
  html: { subject: 'frontend', grades: [5, 11], name: { uz: 'HTML', ru: 'HTML', en: 'HTML' } },
  css: { subject: 'frontend', grades: [5, 11], name: { uz: 'CSS', ru: 'CSS', en: 'CSS' } },
  tailwind: { subject: 'frontend', grades: [5, 11], name: { uz: 'Tailwind CSS', ru: 'Tailwind CSS', en: 'Tailwind CSS' } },
  js: { subject: 'frontend', grades: [5, 11], name: { uz: 'JavaScript', ru: 'JavaScript', en: 'JavaScript' } },
  nodejs: { subject: 'backend', grades: [5, 11], name: { uz: 'Node.js va ES modullar', ru: 'Node.js и ES-модули', en: 'Node.js & ES modules' } },
  http: { subject: 'backend', grades: [5, 11], name: { uz: 'HTTP va Express', ru: 'HTTP и Express', en: 'HTTP & Express' } },
  auth: { subject: 'backend', grades: [5, 11], name: { uz: 'Cookie, Session va JWT', ru: 'Cookie, Session и JWT', en: 'Cookie, Session & JWT' } },
  security: { subject: 'backend', grades: [5, 11], name: { uz: 'Helmet, CORS, .env, Postman', ru: 'Helmet, CORS, .env, Postman', en: 'Helmet, CORS, .env, Postman' } },
  async: { subject: 'backend', grades: [5, 11], name: { uz: 'Asinxronlik va Event Loop', ru: 'Асинхронность и Event Loop', en: 'Async & Event Loop' } },
  rest: { subject: 'backend', grades: [5, 11], name: { uz: 'REST API, Swagger, Multer', ru: 'REST API, Swagger, Multer', en: 'REST API, Swagger, Multer' } },
  mongodb: { subject: 'backend', grades: [5, 11], name: { uz: 'MongoDB va Mongoose', ru: 'MongoDB и Mongoose', en: 'MongoDB & Mongoose' } },
  telegram: { subject: 'backend', grades: [5, 11], name: { uz: 'Telegram bot (Telegraf)', ru: 'Telegram-бот (Telegraf)', en: 'Telegram bot (Telegraf)' } },
  fullstack: { subject: 'backend', grades: [5, 11], name: { uz: 'Fullstack integratsiya', ru: 'Fullstack-интеграция', en: 'Fullstack integration' } },
};

const q = (id, topic, text, options, a, e) => ({ id, topic, subject: TOPICS[topic].subject, q: text, options, a, e });

export const QUESTIONS = [
  q('fr1', 'fractions', '1/2 + 1/3 = ?', ['5/6', '2/5', '1/5', '3/6'], 0, 'Umumiy maxraj 6: 3/6 + 2/6 = 5/6. Maxrajlar qo‘shilmaydi, avval tenglashtiriladi.'),
  q('fr2', 'fractions', '3/4 ning 2/3 qismini toping.', ['1/2', '5/12', '9/8', '2/3'], 0, 'Qismni topish ko‘paytirish bilan: 3/4 · 2/3 = 6/12 = 1/2.'),
  q('fr3', 'fractions', '5/6 − 1/3 = ?', ['1/3', '1/2', '4/3', '4/6'], 1, 'Umumiy maxraj 6: 5/6 − 2/6 = 3/6 = 1/2.'),
  q('eq1', 'equations', '2x + 6 = 14 bo‘lsa, x = ?', ['3', '4', '5', '10'], 1, '2x = 14 − 6 = 8, demak x = 8 : 2 = 4.'),
  q('eq2', 'equations', '3x − 5 = 10 bo‘lsa, x = ?', ['5', '3', '15', '8'], 0, '3x = 10 + 5 = 15, demak x = 5.'),
  q('eq3', 'equations', 'x² = 49 tenglamaning ildizlari qaysi?', ['7', '±7', '49', '−7'], 1, 'Ikkita ildiz bor: 7 va −7, chunki (−7)² ham 49 ga teng.'),
  q('pc1', 'percent', '200 ning 15 foizi nechaga teng?', ['15', '30', '20', '45'], 1, '200 · 15 / 100 = 30.'),
  q('pc2', 'percent', '80 ning necha foizi 20 ga teng?', ['20%', '40%', '25%', '16%'], 2, '20 / 80 = 0,25 = 25%.'),
  q('pc3', 'percent', 'Narxi 100 so‘m bo‘lgan mahsulot 20% arzonlashdi. Yangi narx?', ['80', '120', '20', '90'], 0, '20% = 20 so‘m. 100 − 20 = 80 so‘m.'),
  q('ge1', 'geometry', 'Uchburchak ichki burchaklari yig‘indisi nechaga teng?', ['90°', '180°', '360°', '270°'], 1, 'Har qanday uchburchakda ichki burchaklar yig‘indisi 180°.'),
  q('ge2', 'geometry', 'Tomoni 5 sm bo‘lgan kvadratning yuzi?', ['10 sm²', '20 sm²', '25 sm²', '15 sm²'], 2, 'Kvadrat yuzi = tomon · tomon = 5 · 5 = 25.'),
  q('ge3', 'geometry', 'Radiusi 3 sm bo‘lgan aylananing diametri?', ['3 sm', '9 sm', '12 sm', '6 sm'], 3, 'Diametr radiusdan 2 marta katta: 2 · 3 = 6.'),
  q('ki1', 'kinematics', 'Jism 100 m yo‘lni 20 s da bosdi. Tezligi?', ['5 m/s', '2000 m/s', '10 m/s', '0,2 m/s'], 0, 'v = s / t = 100 / 20 = 5 m/s.'),
  q('ki2', 'kinematics', '72 km/soat tezlik necha m/s?', ['72', '7,2', '36', '20'], 3, '72 · 1000 m / 3600 s = 20 m/s (km/soat ni 3,6 ga bo‘ling).'),
  q('ki3', 'kinematics', 'Jism tinch holatdan 5 s da 10 m/s tezlikka erishdi. Tezlanishi?', ['0,5 m/s²', '2 m/s²', '50 m/s²', '5 m/s²'], 1, 'a = (v − v₀) / t = 10 / 5 = 2 m/s².'),
  q('el1', 'electricity', 'Kuchlanish 12 V, qarshilik 4 Ω. Tok kuchi?', ['48 A', '3 A', '8 A', '0,33 A'], 1, 'Om qonuni: I = U / R = 12 / 4 = 3 A.'),
  q('el2', 'electricity', 'Tok kuchi qaysi birlikda o‘lchanadi?', ['Volt', 'Om', 'Amper', 'Vatt'], 2, 'Tok kuchi amperda (A), kuchlanish voltda, qarshilik omda o‘lchanadi.'),
  q('el3', 'electricity', 'Ketma-ket ulangan 2 Ω va 3 Ω qarshiliklarning umumiy qarshiligi?', ['1,2 Ω', '6 Ω', '5 Ω', '1 Ω'], 2, 'Ketma-ket ulanishda qarshiliklar qo‘shiladi: 2 + 3 = 5 Ω.'),
  q('sp1', 'spelling', 'Qaysi so‘z to‘g‘ri yozilgan?', ['kitop', 'kitob', 'qitob', 'kithob'], 1, 'To‘g‘ri yozilishi: kitob.'),
  q('sp2', 'spelling', 'Tutuq belgisi qaysi so‘zda to‘g‘ri qo‘llangan?', ['mashq‘', 'ma’no', 'sa’at’', 'kita’b'], 1, '“ma’no” so‘zida tutuq belgisi unlilar orasida yoziladi.'),
  q('sp3', 'spelling', 'Qaysi biri bosh harf bilan yoziladi?', ['hafta kunlari', 'Toshkent', 'oylar nomi', 'fasllar nomi'], 1, 'Atoqli otlar (shahar, davlat, ism) bosh harf bilan yoziladi.'),
  q('sw1', 'speech', '“Kitob” so‘zi qaysi so‘z turkumiga kiradi?', ['Ot', 'Sifat', 'Fe’l', 'Son'], 0, 'Narsa nomini bildirib, “nima?” so‘rog‘iga javob bersa — ot.'),
  q('sw2', 'speech', '“Chiroyli” so‘zi qaysi turkumga kiradi?', ['Ot', 'Fe’l', 'Ravish', 'Sifat'], 3, 'Belgi bildirib, “qanday?” so‘rog‘iga javob bersa — sifat.'),
  q('sw3', 'speech', '“Yugurmoq” so‘zi qaysi turkum?', ['Fe’l', 'Ot', 'Son', 'Olmosh'], 0, 'Harakatni bildirib, “nima qilmoq?” so‘rog‘iga javob bersa — fe’l.'),

  // ===== Frontend: har bir mavzuda 14 tadan savol (testda 12 tasi tasodifiy tanlanadi) =====
  q('h1', 'html', 'HTML nimaning qisqartmasi?', ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'HyperText Machine Logic'], 0, 'HTML — gipermatn belgilash tili, veb-sahifa tuzilmasini yozish uchun ishlatiladi.'),
  q('h2', 'html', 'Eng katta sarlavha qaysi teg bilan yoziladi?', ['<h6>', '<h1>', '<head>', '<title>'], 1, '<h1> — eng katta, <h6> — eng kichik sarlavha.'),
  q('h3', 'html', 'Havola (link) yaratish uchun qaysi teg ishlatiladi?', ['<link>', '<url>', '<a>', '<href>'], 2, '<a href="manzil">matn</a> ko‘rinishida yoziladi.'),
  q('h4', 'html', 'Sahifaga rasm qo‘yish tegi qaysi?', ['<picture>', '<image>', '<src>', '<img>'], 3, '<img src="rasm.jpg" alt="tavsif"> — yopuvchi tegi yo‘q.'),
  q('h5', 'html', '<img> tegida rasm manzili qaysi atribut bilan beriladi?', ['href', 'src', 'alt', 'link'], 1, 'src (source) — rasm fayli manzili; href esa havolalarda ishlatiladi.'),
  q('h6', 'html', 'Tartibsiz (nuqtali) ro‘yxat qaysi teg bilan yaratiladi?', ['<ul>', '<ol>', '<li>', '<dl>'], 0, '<ul> — tartibsiz, <ol> — raqamlangan ro‘yxat. Elementlari <li> bilan yoziladi.'),
  q('h7', 'html', 'Matn abzatsi (paragraf) tegi qaysi?', ['<br>', '<pg>', '<p>', '<para>'], 2, '<p> — paragraf tegi.'),
  q('h8', 'html', 'Jadvalning bitta qatori qaysi teg bilan yoziladi?', ['<td>', '<tr>', '<th>', '<row>'], 1, '<tr> — qator, <td> — katak, <th> — sarlavha katagi.'),
  q('h9', 'html', 'Bir qatorli matn kiritish maydoni qaysi teg bilan yaratiladi?', ['<field>', '<line>', '<text>', '<input>'], 3, '<input type="text"> — bir qatorli matn maydoni.'),
  q('h10', 'html', 'HTML5 hujjatining birinchi qatori odatda qanday bo‘ladi?', ['<!DOCTYPE html>', '<html5>', '<start>', '<doc>'], 0, '<!DOCTYPE html> brauzerga hujjat HTML5 ekanini bildiradi.'),
  q('h11', 'html', 'Matnni muhim deb ajratib, qalin ko‘rsatadigan semantik teg qaysi?', ['<big>', '<strong>', '<bold>', '<thick>'], 1, '<strong> — muhim matn (odatda qalin). <bold> degan teg yo‘q.'),
  q('h12', 'html', 'Brauzer yorlig‘ida (tab) ko‘rinadigan sahifa nomi qaysi teg ichiga yoziladi?', ['<header>', '<h1>', '<title>', '<head>'], 2, '<title> tegi <head> ichida joylashadi va tab nomini belgilaydi.'),
  q('h13', 'html', '<br> tegi nima qiladi?', ['Matnni qalin qiladi', 'Yangi qatorga o‘tkazadi', 'Chiziq tortadi', 'Havola yaratadi'], 1, '<br> — qatorni uzadi (line break). Yopuvchi tegi yo‘q.'),
  q('h14', 'html', '<img> dagi alt atributi nima uchun kerak?', ['Rasm o‘lchamini belgilaydi', 'Rasmga havola beradi', 'Rasm ko‘rinmasa o‘rniga matn ko‘rsatadi', 'Rasmni aylantiradi'], 2, 'alt — rasm yuklanmasa yoki ko‘ra olmaydigan foydalanuvchilar uchun matnli tavsif.'),

  q('c1', 'css', 'CSS nimaning qisqartmasi?', ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Colorful Style Sheets'], 1, 'CSS — Cascading Style Sheets, ya’ni kaskadli stillar jadvali.'),
  q('c2', 'css', 'Matn rangini o‘zgartiruvchi CSS xossasi qaysi?', ['font-color', 'text-color', 'color', 'background'], 2, 'Matn rangi color xossasi bilan beriladi. Fon rangi — background-color.'),
  q('c3', 'css', 'Elementning fon rangini beruvchi xossa qaysi?', ['background-paint', 'background-color', 'bg-color-fill', 'background-tint'], 1, 'background-color: red; — fonni qizil qiladi.'),
  q('c4', 'css', 'class="karta" bo‘lgan elementni CSS da qanday tanlaymiz?', ['.karta', '#karta', 'karta', '*karta'], 0, 'Class selektori nuqta (.) bilan boshlanadi.'),
  q('c5', 'css', 'id="menyu" bo‘lgan elementni CSS da qanday tanlaymiz?', ['.menyu', '&menyu', '#menyu', '@menyu'], 2, 'ID selektori panjara (#) bilan boshlanadi.'),
  q('c6', 'css', 'margin xossasi nimani bildiradi?', ['Ichki bo‘sh joy', 'Tashqi bo‘sh joy', 'Chegara qalinligi', 'Shrift o‘lchami'], 1, 'margin — tashqi masofa, padding — ichki masofa.'),
  q('c7', 'css', 'padding xossasi nimani bildiradi?', ['Elementdan tashqaridagi masofa', 'Chegara chizig‘ining rangi', 'Mazmun atrofidagi ichki masofa', 'Elementning umumiy kengligi'], 2, 'padding — elementning ichki bo‘sh joyi.'),
  q('c8', 'css', 'Flexbox ni yoqish uchun qaysi yozuv ishlatiladi?', ['display: flex;', 'position: flex;', 'layout: flex;', 'flex: on;'], 0, 'Konteynerga display: flex berilsa, ichidagi elementlar flex-element bo‘ladi.'),
  q('c9', 'css', 'Flex konteynerda elementlarni asosiy o‘q bo‘ylab markazlash uchun nima yoziladi?', ['justify-text: center;', 'justify-content: center;', 'align-flex: center;', 'flex-center: true;'], 1, 'justify-content — asosiy o‘q, align-items — ko‘ndalang o‘q bo‘yicha joylashtiradi.'),
  q('c10', 'css', 'Shrift o‘lchamini belgilaydigan xossa qaysi?', ['text-size', 'font-style', 'size', 'font-size'], 3, 'font-size: 16px; — shrift o‘lchami.'),
  q('c11', 'css', 'Element atrofiga ramka chizish uchun qaysi xossa ishlatiladi?', ['border', 'frame', 'stroke', 'edge'], 0, 'border: 1px solid black; — ramka qalinligi, turi va rangini beradi.'),
  q('c12', 'css', 'Sichqoncha elementning ustiga kelganda ishlaydigan pseudo-klass qaysi?', [':click', ':focus', ':hover', ':active'], 2, ':hover — kursor element ustida turganda.'),
  q('c13', 'css', 'Tashqi CSS faylini HTML ga ulashning to‘g‘ri usuli qaysi?', ['<style href="style.css">', '<link rel="stylesheet" href="style.css">', '<css rel="stylesheet" href="style.css">', '<script src="style.css" rel="css">'], 1, 'Tashqi stil <head> ichida <link rel="stylesheet" href="..."> bilan ulanadi.'),
  q('c14', 'css', 'Elementni yashirib, sahifada joyini ham egallamaydigan qiladigan yozuv qaysi?', ['visibility: hidden;', 'opacity: 1;', 'display: none;', 'hide: true;'], 2, 'display: none — element umuman chizilmaydi. visibility: hidden joyini saqlab qoladi.'),

  q('t1', 'tailwind', 'Tailwind CSS nima?', ['Utility-first CSS freymvorki', 'JavaScript kutubxonasi', 'Ma’lumotlar bazasi', 'Backend freymvorki'], 0, 'Tailwind — tayyor kichik klasslar (utility) bilan to‘g‘ridan-to‘g‘ri HTML da stil beradigan CSS freymvorki.'),
  q('t2', 'tailwind', 'Tailwind da matnni qizil rangga bo‘yash klassi qaysi?', ['color-red', 'red-text', 'font-red', 'text-red-500'], 3, 'Matn rangi text-{rang}-{daraja} ko‘rinishida: text-red-500.'),
  q('t3', 'tailwind', 'Tailwind da fonni ko‘k rangga bo‘yash klassi qaysi?', ['bg-blue-500', 'background-blue', 'blue-bg', 'color-blue-500'], 0, 'Fon uchun bg- prefiksi ishlatiladi: bg-blue-500.'),
  q('t4', 'tailwind', 'Tailwind da ichki masofa (padding) berish klassi qaysi?', ['pad-4', 'p-4', 'padding-4', 'in-4'], 1, 'p-4 — barcha tomondan 1rem (16px) padding.'),
  q('t5', 'tailwind', 'Tailwind da tashqi masofa (margin) berish klassi qaysi?', ['mg-4', 'out-4', 'm-4', 'margin-4'], 2, 'm-4 — barcha tomondan 1rem margin.'),
  q('t6', 'tailwind', 'Tailwind da flexbox ni yoqish klassi qaysi?', ['flex', 'display-flex', 'd-flex', 'flexbox'], 0, 'Oddiygina flex klassi display: flex; ni beradi.'),
  q('t7', 'tailwind', 'Tailwind da burchaklarni yumaloq qilish klassi qaysi?', ['round-lg', 'radius-lg', 'corner-lg', 'rounded-lg'], 3, 'rounded-lg — border-radius: 0.5rem.'),
  q('t8', 'tailwind', 'Sichqoncha ustiga kelganda fon rangi o‘zgarishi uchun qaysi yozuv to‘g‘ri?', ['hover:bg-blue-700', 'on-hover:bg-blue-700', 'bg-blue-700:hover', 'hover-bg-blue-700'], 0, 'Holat prefiksi ikki nuqta bilan yoziladi: hover:bg-blue-700.'),
  q('t9', 'tailwind', 'Ekran kengligi 768px va undan katta bo‘lganda ishlaydigan prefiks qaysi?', ['sm:', 'xl:', 'md:', 'lg-'], 2, 'Tailwind da md: — 768px dan boshlab. Tailwind mobil-birinchi (mobile-first) yondashuvda ishlaydi.'),
  q('t10', 'tailwind', 'Elementni ota-elementining to‘liq kengligiga cho‘zish klassi qaysi?', ['width-100', 'w-full', 'full-w', 'w-max'], 1, 'w-full — width: 100%.'),
  q('t11', 'tailwind', 'Matnni qalin qilish klassi qaysi?', ['text-bold', 'bold', 'font-bold', 'weight-bold'], 2, 'font-bold — font-weight: 700.'),
  q('t12', 'tailwind', '3 ustunli setka (grid) hosil qilish uchun qaysi klasslar ishlatiladi?', ['grid-3', 'grid grid-cols-3', 'grid col-3', 'columns-grid-3'], 1, 'grid + grid-cols-3 — teng uchta ustun.'),
  q('t13', 'tailwind', 'Tailwind v3 ni sozlash uchun odatda qaysi fayl ishlatiladi?', ['style.config', 'tailwind.json', 'tw.settings', 'tailwind.config.js'], 3, 'tailwind.config.js da ranglar, shriftlar va content yo‘llari sozlanadi.'),
  q('t14', 'tailwind', 'Tailwind da qorong‘i rejim (dark mode) uchun qaysi prefiks ishlatiladi?', ['dark:', 'night:', 'black:', 'mode-dark:'], 0, 'dark:bg-gray-900 kabi yoziladi.'),

  q('j1', 'js', 'JavaScript da qiymati keyin o‘zgarmaydigan o‘zgaruvchi qaysi kalit so‘z bilan e’lon qilinadi?', ['let', 'const', 'var', 'fixed'], 1, 'const — qayta tayinlab bo‘lmaydigan o‘zgaruvchi.'),
  q('j2', 'js', '"5" + 3 ifodasining natijasi nima?', ['8', '"8"', '"53"', 'undefined'], 2, '+ operatori matn bilan uchrashsa, birlashtiradi (konkatenatsiya): "53".'),
  q('j3', 'js', '=== operatori nimani solishtiradi?', ['Faqat qiymatni', 'Qiymat va turni', 'Faqat turni', 'Hech narsani, qiymat beradi'], 1, '=== qat’iy tenglik: 5 === "5" — false, 5 == "5" — true.'),
  q('j4', 'js', 'Massivning oxiriga element qo‘shadigan metod qaysi?', ['pop()', 'shift()', 'add()', 'push()'], 3, 'push() oxiriga qo‘shadi, pop() oxirgisini olib tashlaydi.'),
  q('j5', 'js', 'Massiv elementlari sonini beradigan xossa qaysi?', ['length', 'size', 'count', 'length()'], 0, 'arr.length — massiv uzunligi.'),
  q('j6', 'js', 'ID bo‘yicha HTML elementni topish metodi qaysi?', ['document.getElement()', 'document.findById()', 'document.getElementById()', 'window.getById()'], 2, 'document.getElementById("nom") — shu ID dagi elementni qaytaradi.'),
  q('j7', 'js', 'Konsolga ma’lumot chiqarish uchun nima ishlatiladi?', ['print()', 'console.log()', 'echo()', 'System.out()'], 1, 'console.log() — brauzer konsoliga yozadi.'),
  q('j8', 'js', 'Quyidagilardan qaysi biri to‘g‘ri arrow funksiya?', ['const f = () => {}', 'function => f {}', 'def f(): pass', 'const f = => () {}'], 0, 'Arrow funksiya: const f = (a, b) => a + b;'),
  q('j9', 'js', 'Massivning har bir elementidan yangi massiv hosil qiladigan metod qaysi?', ['forEach()', 'push()', 'map()', 'splice()'], 2, 'map() yangi massiv qaytaradi, forEach() esa hech narsa qaytarmaydi.'),
  q('j10', 'js', 'Elementga hodisa (masalan, bosish) tinglovchisini qo‘shish metodi qaysi?', ['listenEvent()', 'setEvent()', 'registerEventListener()', 'addEventListener()'], 3, 'el.addEventListener("click", funksiya) shaklida ishlatiladi.'),
  q('j11', 'js', '2 + 2 * 2 ifodasining natijasi nechaga teng?', ['8', '6', '4', '10'], 1, 'Avval ko‘paytirish: 2 * 2 = 4, keyin 2 + 4 = 6.'),
  q('j12', 'js', 'Obyektni JSON matniga aylantiruvchi metod qaysi?', ['JSON.parse()', 'JSON.toString()', 'JSON.stringify()', 'JSON.text()'], 2, 'JSON.stringify() — obyekt → matn, JSON.parse() — matn → obyekt.'),
  q('j13', 'js', 'Quyidagi qiymatlardan qaysi biri JavaScript da false (falsy) hisoblanadi?', ['0', '"0" (matn)', '[] (bo‘sh massiv)', '{} (bo‘sh obyekt)'], 0, 'Falsy: 0, "", null, undefined, NaN, false. Bo‘sh massiv va obyekt true hisoblanadi.'),
  q('j14', 'js', 'Quyidagilardan qaysi biri JavaScript da shartli operator?', ['if (a > b) {}', 'for a in b:', 'when a > b {}', 'check (a > b)'], 0, 'if (shart) { ... } else { ... } — shartli operator.'),
];

// Sodda va oson savollar (har bir mavzuda 20 tadan; variantlar bir xil uzunlikda)
[...generateAll(20), ...FRONT_EXTRA, ...BACKEND_SIMPLE, ...UZ_QUESTIONS].forEach((x) => {
  const key = x.q + '|' + x.options[x.a];
  if (QUESTIONS.some((y) => y.q + '|' + y.options[y.a] === key)) return; // takrorni o‘tkazib yuboramiz
  QUESTIONS.push({ ...x, subject: TOPICS[x.topic].subject });
});


export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function shuffleOptions(x) {
  const order = shuffle(x.options.map((_, i) => i));
  return { ...x, options: order.map((i) => x.options[i]), a: order.indexOf(x.a) };
}

export function buildTest({ subject, topic, grade }, limit = 30) {
  let list = QUESTIONS.filter((x) => x.subject === subject && (topic === 'all' || x.topic === topic));
  const byGrade = list.filter((x) => grade >= TOPICS[x.topic].grades[0] && grade <= TOPICS[x.topic].grades[1]);
  if (byGrade.length >= 3) list = byGrade;
  return shuffle(list).slice(0, limit).map(shuffleOptions);
}
