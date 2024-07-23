export type Language = {
  id: string;
  label: string;
  code: string;

  dir?: 'ltr' | 'rtl';
};

export const defaultLang = 'en';
export const ns = ['default', 'pages'];
export const languagesObject: Record<string, Language> = {
  en: {
    id: 'en',
    label: 'English',
    code: 'gb',
  },
  ru: {
    id: 'ru',
    label: 'Русский',
    code: 'ru',
  },
};
export const languagesList: Language[] = [
  languagesObject?.['en'],
  languagesObject?.['ru'],
];
