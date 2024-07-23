import {FC, PropsWithChildren, useCallback, useRef, useState} from "react";
import {NewWebSocketClient, NewWebSocketInfo, NewWebSocketStatus} from "@/utils/socket.ts";
import {createSocketMainContext, SocketCallbackDTO} from "@/hooks/useWebSocket/MainSocket/context.tsx";
import {Store} from "@/zustand";
import {
	MainSocketCallbackDTO,
	MainSocketResponseDTO,
	MainSocketSubscribeRequestDTO, SocketMessageRequestDTO, SocketSubMessageDTO
} from "./types";
import {getErrorMessageFromE} from "@/utils/errors.ts";

type WebSocketProviderOption = {
	name: string;
	url: string;
	reconnectTimeout?: number;
}

export const MainSocketContext = createSocketMainContext()
type SubscribesRef = Map<string, { req: MainSocketSubscribeRequestDTO, fn: MainSocketCallbackDTO[] }>
export const MainSocketProvider: FC<PropsWithChildren<{ option: WebSocketProviderOption }>> = ({children, option}) => {
	const currentRequstId = useRef(0);
	const clientRef = useRef<NewWebSocketClient | null>(null);

	const messagesRef = useRef<Map<number, SocketCallbackDTO<SocketSubMessageDTO[]>>>(new Map());



	const subscribesRef = useRef<SubscribesRef>(new Map());
	const [connectInfo, setConnectInfo] = useState<NewWebSocketInfo | null>(null);

	const getSubscribeKey = (req: MainSocketSubscribeRequestDTO) => `${req.op}::${req.args}`

	const switchUpdate = useCallback((res: SocketMessageRequestDTO<SocketSubMessageDTO> | MainSocketResponseDTO) => {
		// get statuses
		if('id' in res){
			const id = res.id
			if(id){
				const fn = messagesRef.current.get(id)
				fn?.(res.subs)
				messagesRef.current.delete(id)
			}
		}else {
			// subscribe
			switch (res.op) {
				case 'subscribe':{
					break;
				}
				case 'unsubscribe':{
					break;
				}
			}
		}
	},[])

	const connect = useCallback(() => {
		if (clientRef.current) {
			clientRef.current.open()
			return;
		}
		if (!option.url) {
			console.warn(`SocketURL  don't found`);
			return;
		}

		const onOpened = (info: NewWebSocketInfo) => {
			setConnectInfo(info)
		}
		const onClosed = (info: NewWebSocketInfo) => {
			setConnectInfo(info)
		}
		const onError = (info: NewWebSocketInfo) => {
			setConnectInfo(info)
		}
		const onConnection = (info: NewWebSocketInfo) => {
			setConnectInfo(info)
		}
		const onUpdate = (info: NewWebSocketInfo) => {
			const {pong} = Store.app.getState()
			if (info.data === 'ping' && pong) {
				clientRef.current?.sendMessage('pong')
			} else {
				setConnectInfo(info)
				if(!info.data) return
				try {
					switchUpdate(JSON.parse(info.data))
				}catch (e) {
					alert(getErrorMessageFromE(e))
				}
			}
		}
		const client = new NewWebSocketClient({
			connectionName: option.name,
			url: option.url,
			reconnectTimeout: option.reconnectTimeout,
			// debugging: true,
			// onRestore,
			onOpened,
			onClosed,
			onError,
			onConnection,
			onUpdate,
		});
		clientRef.current = client
		client.open()
	}, [option]);
	const stop = useCallback(() => {
		if (clientRef.current) {
			clientRef.current.close()
			return;
		}
	}, []);
	const disconnect = useCallback(() => {
		if (clientRef.current) {
			clientRef.current.breakConnection()
			return;
		}
	}, []);

	const sendMessage = <T extends Array<SocketSubMessageDTO>>(subs: T, callback?: SocketCallbackDTO<T>) :void => {
		const client = clientRef.current
		if (!client) return
		try {
			if (client?.getInfo().conn?.status === NewWebSocketStatus.CONNECTED) {
				// make ID
				currentRequstId.current += 1
				const id = currentRequstId.current

				// make request
				const request: SocketMessageRequestDTO<T> = {
					id,
					subs,
				}
				const data = JSON.stringify(request)
				if(client?.sendMessage(data) && callback){
					messagesRef.current.set(id, callback as SocketCallbackDTO<SocketSubMessageDTO[]>)
				}
			}
		} catch (e) {
			console.error("[useWebSocket]:", e)
		}
	};
	// const subscribe = <T extends Array<SocketSubMessageDTO>>(req: T, callback?: SocketCallbackDTO<T>) :void => {
	// 	const client = clientRef.current
	// 	if (!client) return
	// 	try {
	// 		if (client?.getInfo().conn?.status === NewWebSocketStatus.CONNECTED) {
	// 			// make req
	// 			const req: MainSocketSubscribeRequestDTO = {
	// 				op: 'subscribe',
	// 				args
	// 			}
	// 			// make ID
	// 			const key = getSubscribeKey(req)
	//
	// 			// make request
	// 			const data = JSON.stringify(req)
	// 			if(client?.sendMessage(data) && callback){
	// 				// get data
	// 				let elem: { req: MainSocketSubscribeRequestDTO, fn: MainSocketCallbackDTO[] } = {
	// 					req,
	// 					fn: [callback]
	// 				}
	// 				const item = subscribesRef.current.get(key)
	// 				if(item){
	// 					item.fn.push(callback)
	// 					elem = item
	// 				}
	// 				// set data
	// 				subscribesRef.current.set(key, elem)
	// 			}
	// 		}
	// 	} catch (e) {
	// 		console.error("[useWebSocket]:", e)
	// 	}
	// };
	// const unsubscribe = (args: string) => {
	// 	const client = clientRef.current
	// 	if (!client) return
	// 	try {
	// 		if (client?.getInfo().conn?.status === NewWebSocketStatus.CONNECTED) {
	// 			// make req
	// 			const req: MainSocketSubscribeRequestDTO = {
	// 				op: 'unsubscribe',
	// 				args
	// 			}
	// 			// make request
	// 			const data = JSON.stringify(req)
	// 			client?.sendMessage(data)
	// 		}
	// 	} catch (e) {
	// 		console.error("[useWebSocket]:", e)
	// 	}
	// };

	return (
		<MainSocketContext.Provider
			value={{client: clientRef.current, connectInfo, connect, stop, disconnect, sendMessage,
				// subscribe,
				// unsubscribe
		}}>
			{children}
		</MainSocketContext.Provider>
	);
};
