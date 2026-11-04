import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translations } from './translations.js';

const LangContext = createContext(null);
export const LANGS = ['uz', 'ru', 'en'];

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem('xx_lang');
    return LANGS.includes(saved) ? saved : 'uz';
  });

  const setLang = useCallback((l) => {
    if (!LANGS.includes(l)) return;
    localStorage.setItem('xx_lang', l);
    setLangState(l);
  }, []);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const t = useCallback((key, vars = {}) => {
    let s = translations[lang]?.[key] ?? translations.uz[key] ?? key;
    Object.entries(vars).forEach(([k, v]) => { s = s.replaceAll(`{${k}}`, v); });
    return s;
  }, [lang]);

  const pick = useCallback((obj) => (obj ? obj[lang] ?? obj.uz : ''), [lang]);

  return <LangContext.Provider value={{ lang, setLang, t, pick }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
