import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { translations } from '../i18n'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('xx_lang') || 'uz')

  const setLang = useCallback((l) => {
    if (!translations[l]) return
    setLangState(l)
    localStorage.setItem('xx_lang', l)
    document.documentElement.lang = l
  }, [])

  const t = useCallback(
    (key, vars = {}) => {
      let s = translations[lang]?.[key] ?? translations.en[key] ?? key
      Object.entries(vars).forEach(([k, v]) => {
        s = s.replaceAll(`{${k}}`, v)
      })
      return s
    },
    [lang]
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
