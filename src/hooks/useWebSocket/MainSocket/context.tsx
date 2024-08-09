import { createContext } from 'react';
import { WebSocketClient, WebSocketInfo } from '@t34-dev/ts-ws-client';
import { SocketSubMessageDTO } from './types';

export type SocketCallbackDTO<T> = (response: T) => void;

export const createSocketMainContext = () =>
	createContext<{
		client: WebSocketClient | null;
		connectInfo: WebSocketInfo | null;
		connect: () => void;
		stop: () => void;
		disconnect: () => void;
		sendMessage: <T extends Array<SocketSubMessageDTO>>(
			req: T,
			callback?: SocketCallbackDTO<T>,
		) => void;
		subscribe: <T extends Array<string>>(
			req: T,
			callback?: SocketCallbackDTO<T>,
		) => void;
		// subscribe: (args: string[], callback?: SocketCallbackDTO)=>void
		// unsubscribe: (args: string[])=>void
	}>({
		client: null,
		connectInfo: null,
		connect: () => {},
		stop: () => {},
		disconnect: () => {},
		sendMessage: () => {},
		subscribe: () => {},
		// unsubscribe:  ()  =>  {}
	});
