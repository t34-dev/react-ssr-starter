import { parseBoolean } from '@/utils/boolean.ts';

const ENV = {
	IS_DEV: import.meta.env.DEV,
	IS_PRODUCTION: import.meta.env.PROD,
	SSR: parseBoolean(import.meta.env.VITE_SSR),

	BASE_HTTP_URL: import.meta.env.VITE_BASE_HTTP_URL || '',
	BASE_WS_URL: import.meta.env.VITE_BASE_WS_URL || '',

	// LOCALHOST: process.env.NEXT_PUBLIC_LOCALHOST || "",
	BACKEND_SOCKET: import.meta.env.VITE_BACKEND_SOCKET,
	BACKEND_ADDRESS: import.meta.env.VITE_BACKEND_ADDRESS,

	I18NEXUS_API_KEY: import.meta.env.VITE_I18NEXUS_API_KEY || '1',
	I18NEXUS_IF_FILES: parseBoolean(import.meta.env.VITE_I18NEXUS_LOCAL || '1'),
};

export { ENV };
