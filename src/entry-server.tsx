import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { App } from './App';
import { StaticRouter } from 'react-router-dom/server';
import { queryClient } from '@/react-query';
import { QueryClientProvider } from '@tanstack/react-query';

export function render(url: string) {
	const html = ReactDOMServer.renderToString(
		<React.StrictMode>
			<StaticRouter location={url}>
				<QueryClientProvider client={queryClient}>
					<App />
				</QueryClientProvider>
			</StaticRouter>
		</React.StrictMode>,
	);
	return { html };
}
