import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { render } from '../dist/server/entry-server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function handler(req, res) {
	console.log('Request received for URL:', req.url);
	try {
		const url = req.url;
		console.log('Rendering for URL:', url);
		const { html: appHtml } = await render(url);
		console.log('App HTML rendered successfully');

		const indexPath = path.resolve(__dirname, '../dist/client/index.html');
		console.log('Reading index.html from:', indexPath);

		// Читаем содержимое index.html
		const indexHtml = fs.readFileSync(indexPath, 'utf-8');
		console.log('index.html read successfully');

		// Заменяем placeholder на отрендеренный HTML приложения
		const finalHtml = indexHtml.replace('<!--app-html-->', appHtml);
		console.log('Final HTML prepared');

		res.setHeader('Content-Type', 'text/html');
		res.status(200).send(finalHtml);
		console.log('Response sent successfully');
	} catch (error) {
		console.error('Error in server.js:', error);
		res.status(500).send('Internal Server Error: ' + error.message);
	}
}
