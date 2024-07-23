import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export function useTranslatedArray<T>(
  array = [] as T[],
  key: keyof T | (keyof T)[],
) {
  const { t, i18n } = useTranslation();

  return useMemo(() => {
    if (Array.isArray(key)) {
      let res: T[] = array;

      key.forEach((elem) => {
        res = res
          .filter((elem) => !!elem)
          .map((item) => ({
            ...item,
            [elem]: t(item[elem as keyof T] as unknown as string),
          }));
      });

      return res;
    } else {
      return array
        .filter((elem) => !!elem)
        .map((item) => ({
          ...item,
          [key]: t(item[key as keyof T] as unknown as string),
        }));
    }
  }, [t, array, key, i18n.language]);
}
