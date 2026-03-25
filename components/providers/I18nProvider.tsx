'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { id as idDict } from '@/lib/i18n/id';
import { en as enDict } from '@/lib/i18n/en';
import type { DictionaryShape, Locale } from '@/lib/i18n';

const dictionaries: Record<Locale, DictionaryShape> = { id: idDict, en: enDict };

interface I18nContextValue {
  locale: Locale;
  t: DictionaryShape;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'id',
  t: idDict,
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('medflow-locale') as Locale) || 'id';
    }
    return 'id';
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('medflow-locale', l);
    document.documentElement.lang = l;
  }, []);

  const value = useMemo(
    () => ({ locale, t: dictionaries[locale], setLocale }),
    [locale, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
