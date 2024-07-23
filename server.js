import fs from 'node:fs/promises';
import express from 'express';
import https from 'https';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV, process.cwd(), '');
let isHTTPS = parseBoolean(env.HTTPS);
const isDev = env.NODE_ENV === 'development';
const isDocker = parseBoolean(env.IS_DOCKER);

// =====================================================
let hostname = env.HOST || 'localhost';
let port = parseInt(env.PORT);
if (!port) port = isHTTPS ? 443 : isDev ? 5173 : 4173;
// =====================================================

if (isDocker) {
	port = 3000;
	hostname = '0.0.0.0';
	isHTTPS = false;
}

const base = env.BASE || '/';
const certDir = isHTTPS ? resolve(dirname(fileURLToPath(import.meta.url)), '.certs') : '';

// Cached production assets
const templateHtml = !isDev ? await fs.readFile('./dist/client/index.html', 'utf-8') : '';
const ssrManifest = !isDev ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8') : undefined;

// Create http server
const app = express();

// Add Vite or respective production middlewares
let vite;
if (isDev) {
	const { createServer } = await import('vite');
	vite = await createServer({
		server: { middlewareMode: true },
		appType: 'custom',
		base,
	});
	app.use(vite.middlewares);
} else {
	const compression = (await import('compression')).default;
	const sirv = (await import('sirv')).default;
	app.use(compression());
	app.use(base, sirv('./dist/client', { extensions: [] }));
}

// Serve HTML
app.use('*', async (req, res) => {
	try {
		const url = req.originalUrl.replace(base, '');

		let template;
		let render;
		if (isDev) {
			// Always read fresh template in development
			template = await fs.readFile('./index.html', 'utf-8');
			template = await vite.transformIndexHtml(url, template);
			render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
		} else {
			template = templateHtml;
			render = (await import('./dist/server/entry-server.js')).render;
		}

		const rendered = await render(url, ssrManifest);

		const html = template
			.replace(`<!--app-head-->`, rendered.head ?? '')
			.replace(`<!--app-html-->`, rendered.html ?? '');

		res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
	} catch (e) {
		vite?.ssrFixStacktrace(e);
		console.log(e.stack);
		res.status(500).end(e.stack);
	}
});

if (isHTTPS) {
	https
		.createServer(
			{
				key: readFileSync(resolve(certDir, './cert.key')),
				cert: readFileSync(resolve(certDir, './cert.crt')),
			},
			app,
		)
		.listen(port, () => {
			console.log(`HTTPS Server is running at https://${hostname}:${port}`);
		});
} else {
	// Start http server
	app.listen(port, () => {
		console.log(`Server started at http://localhost:${port}`);
	});
}

function parseBoolean(str) {
	return (str || '').trim().toLowerCase() === 'true';
}
