import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { languagesList, languagesObject } from '@/i18n';
import { Store } from '@/zustand';

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const setLanguage = useCallback(
    (lng: string) => {
      Store.app.set({
        loadingFly: true,
      });
      i18n.changeLanguage(lng);
    },
    [i18n],
  );

  return {
    languagesObject,
    languagesList,
    setLanguage,
  };
};
