import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			gcTime: 10 * 60 * 1000, // 10 min
			staleTime: 10 * 60 * 1000, // 10 min
		},
	},
});
