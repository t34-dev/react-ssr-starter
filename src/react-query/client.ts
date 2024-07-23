import { QueryClient } from 'react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 10 * 60 * 1000, // 10 min
      staleTime: 10 * 60 * 1000, // 10 min
    },
  },
});
