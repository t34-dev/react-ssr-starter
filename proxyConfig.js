// export const getProxyConfig = (env) => ({
// 	'/api': {
// 		target: env.VITE_API_URL || 'http://localhost:8080',
// 		changeOrigin: true,
// 		rewrite: (path) => path.replace(/^\/api/, ''),
// 		ws: true,
// 	},
// });

export const getProxyConfig = (env) => {
	return [
		{
			key: '/api',
			target: env.VITE_API_URL || '',
			changeOrigin: true,
			rewrite: (path) => path.replace(/^\/api/, ''),
			ws: true,
		},
	];
};

export const getProxyObject = (env) =>
	(getProxyConfig(env) || []).reduce((prev, elem) => {
		const { key, ...rest } = elem;
		prev[key] = rest;
		return prev;
	}, {});
