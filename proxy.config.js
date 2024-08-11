export const getProxyConfig = (env) => {
	return [
		{
			pathUrl: '/api',
			target: env.VITE_API_URL || '',
			changeOrigin: true,
			rewrite: (path) => path.replace(/^\/api/, ''),
			ws: true,
		},
	];
};

export const getProxyObject = (env) =>
	(getProxyConfig(env) || []).reduce((prev, elem) => {
		const { pathUrl, ...rest } = elem;
		prev[pathUrl] = rest;
		return prev;
	}, {});
