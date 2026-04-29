import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Lang } from '@/lib/i18n';

interface Ctx { lang: Lang; setLang: (l: Lang) => void; }
const LanguageContext = createContext<Ctx>({ lang: 'en', setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem('eg_lang') as Lang | null) : null;
    if (stored && ['en','hi','te'].includes(stored)) return stored;
    const browser = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en';
    if (browser.startsWith('hi')) return 'hi';
    if (browser.startsWith('te')) return 'te';
    return 'en';
  });
  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem('eg_lang', l); document.documentElement.lang = l; };
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}
export const useLang = () => useContext(LanguageContext);
