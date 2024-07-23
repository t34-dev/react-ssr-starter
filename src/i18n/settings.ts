import i18n, { InitOptions } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { ENV } from '@/env.ts';
import { languagesList, ns } from '@/i18n/vars.ts';

if (!ENV.I18NEXUS_API_KEY) {
  throw new Error('VITE_I18NEXUS_API_KEY is empty!');
}
const loadPath = `https://api.i18nexus.com/project_resources/translations/{{lng}}/{{ns}}.json?api_key=${ENV.I18NEXUS_API_KEY}`;

const config: InitOptions = {
  // fallbackLng: defaultLang,  // when to always download
  ns,
  defaultNS: ns[0],
  supportedLngs: languagesList.map((elem) => elem.id),
};

if (ENV.I18NEXUS_IF_FILES) {
  config.backend = {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  };
} else {
  config.backend = {
    loadPath,
  };
}

i18n.use(HttpBackend).use(LanguageDetector).use(initReactI18next).init(config);

export { i18n };
