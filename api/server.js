import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { render } from '../dist/server/entry-server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function handler(req, res) {
	try {
		const url = req.url;
		const { html: appHtml } = await render(url);

		// Читаем содержимое index.html
		const indexHtml = fs.readFileSync(path.resolve(__dirname, '../dist/client/index.html'), 'utf-8');

		// Заменяем placeholder на отрендеренный HTML приложения
		const finalHtml = indexHtml.replace('<!--app-html-->', appHtml);

		res.setHeader('Content-Type', 'text/html');
		res.status(200).send(finalHtml);
	} catch (error) {
		console.error('Error in server.js:', error);
		res.status(500).send('Internal Server Error');
	}
}
