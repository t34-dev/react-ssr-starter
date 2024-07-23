import clsx from 'clsx';
import { FC } from 'react';

import { i18n, useLanguage } from '@/i18n';

interface LanguageSwitcherProps {
  className?: string;
}
const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ className }) => {
  const { setLanguage, languagesList } = useLanguage();

  // const changeLanguage = (lng: string) => {
  //   i18n.changeLanguage(lng);
  //
  //   const { pathname } = location;
  //   const pathParts = pathname.split('/').filter(Boolean);
  //
  //   // Если в URL уже есть префикс языка, заменяем его; иначе добавляем/удаляем префикс
  //   if (languagesList.map((elem) => elem.id).includes(pathParts[0])) {
  //     pathParts[0] = lng === defaultLang ? '' : lng;
  //   } else {
  //     pathParts[0] = lng === defaultLang ? pathParts[0] : lng;
  //   }
  //
  //   const newPathname = `/${pathParts.filter(Boolean).join('/')}`;
  //   // navigate(newPathname, { replace: true }); // Обновляем URL и заменяем текущий элемент истории
  // };

  return (
    <div className={clsx(className)}>
      {languagesList.map((lng) => (
        <button
          key={lng.id}
          onClick={() => setLanguage(lng.id)}
          disabled={i18n.language === lng.id}
          style={{ fontWeight: i18n.language === lng.id ? 'bold' : 'normal' }}
        >
          {lng.label}
        </button>
      ))}
    </div>
  );
};

export { LanguageSwitcher };
