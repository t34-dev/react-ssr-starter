import { useEffect } from 'react';

export const usePageTitle = (title?: string): void  => {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = title || '';
    }
  }, [title]);
}
