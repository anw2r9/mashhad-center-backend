'use client';
import { createContext, useContext, useState } from 'react';

type Lang = 'ar' | 'he';

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (ar: string, he: string) => string;
}>({
  lang: 'ar',
  setLang: () => {},
  t: (ar) => ar,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('ar');
  const t = (ar: string, he: string) => lang === 'ar' ? ar : he;
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);