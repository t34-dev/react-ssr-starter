import { render } from '../dist/server/entry-server.js';

export default async function handler(req, res) {
	const url = req.url;
	const { html } = await render(url);

	res.setHeader('Content-Type', 'text/html');
	res.end(html);
}
