export { id, type Dictionary, type DictionaryShape } from './id';
export { en } from './en';

export type Locale = 'id' | 'en';

export const locales: Locale[] = ['id', 'en'];
export const defaultLocale: Locale = 'id';

export const localeNames: Record<Locale, string> = {
  id: 'Bahasa Indonesia',
  en: 'English',
};
