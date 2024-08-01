import './assets/scss/index.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { queryClient } from '@/react-query';
import { QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { ENV } from '@/env.ts';
import { MainSocketProvider } from '@/hooks/useWebSocket/MainSocket/provider.tsx';
import { parseBoolean } from '@/utils/boolean.ts';

const rootElement = document.getElementById('root') as HTMLElement;
if (parseBoolean(import.meta.env.VITE_SSR)) {
	ReactDOM.hydrateRoot(
		document.getElementById('root') as HTMLElement,
		<React.StrictMode>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</React.StrictMode>,
	);
} else {
	ReactDOM.createRoot(rootElement).render(
		<QueryClientProvider client={queryClient}>
			<MainSocketProvider
				option={{
					name: 'main',
					url: ENV.BASE_WS_URL,
					reconnectTimeout: 1000,
				}}
			>
				{/*<Socket1Provider option={{*/}
				{/*	name: 'poligon1',*/}
				{/*	url: ENV.BASE_WS_URL,*/}
				{/*	reconnectTimeout: 1000*/}
				{/*}}>*/}
				{/*	<Socket2Provider option={{*/}
				{/*		name: 'poligon2',*/}
				{/*		url: ENV.BASE_WS_URL,*/}
				{/*		reconnectTimeout: 1000*/}
				{/*	}}>*/}
				<BrowserRouter>
					<App />
				</BrowserRouter>
				{/*	</Socket2Provider>*/}
				{/*</Socket1Provider>*/}
			</MainSocketProvider>
		</QueryClientProvider>,
	);
}
