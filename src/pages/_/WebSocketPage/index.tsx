import {FC, useCallback, useEffect, useState} from 'react';

import s from './index.module.scss';
import {NewWebSocketClient, NewWebSocketInfo, NewWebSocketStore} from "@/utils/socket.ts";
import {Container} from '@/components';
import {ENV} from "@/env.ts";

type WSItem = {
	client: NewWebSocketClient,
	info: NewWebSocketInfo,
}

export const WebSocketPage: FC = () => {
	const [ws, setWs] = useState<WSItem | null>(null)

	const setVelueWs = useCallback((data: Partial<WSItem> | null) => {
		if (!data) setWs(null)
		setWs((prev) => {
			if (!prev) {
				console.error("Отсутствует предыдущее значение")
				return prev
			}
			return {
				...prev,
				...data,
			};
		})
	}, [])

	useEffect(() => {
		const onOpened = (info: NewWebSocketInfo) => {
			console.log('myFuncOpened')
			setVelueWs({
				info
			})
		}
		const onClosed = (info: NewWebSocketInfo) => {
			console.log('myFunClosed')
			setVelueWs({
				info
			})
		}
		const onError = (info: NewWebSocketInfo) => {
			console.log('myFuncError', info.data)
			setVelueWs({
				info
			})
		}
		const onConnection = (info: NewWebSocketInfo) => {
			console.log('myConnection')
			setVelueWs({
				info
			})
		}
		const onUpdate = (info: NewWebSocketInfo) => {
			console.log('myFuncMessage', info.data)
			setVelueWs({
				info
			})
		}
		const onRestore = (storedRequests: NewWebSocketStore) => {
			storedRequests.delete('unnecessaryKey');

			return storedRequests;
		}
		const client = new NewWebSocketClient({
			connectionName: 'test',
			url: ENV.BASE_WS_URL,
			reconnectTimeout: 1000,
			onRestore,
			onOpened,
			onClosed,
			onError,
			onConnection,
			onUpdate,
			// getReqKeySubscribe: (data) => {
			// 	let key = data
			// 	try {
			// 		const d = JSON.parse(data) as {topic:string, args: number}
			// 		key = `${d.topic}-${d.args}`
			// 	}catch (e) {}
			// 	return key;
			// },
			// getResKeySubscribe: (data) => {
			// 	let key = data
			// 	try {
			// 		const d = JSON.parse(data) as {topic:string, args: number}
			// 		key = `${d.topic}-${d.args}`
			// 	}catch (e) {}
			// 	return key;
			// },
		});
		setWs({
			client,
			info: client.getInfo()
		})
	}, []);


	const Sub1 = 'subscribe1'
	const Sub2 = 'subscribe2'
	const Sub3 = 'subscribe3'
	return (
		<Container>
			<div className={s.wrap}>
				<button onClick={() => {
					ws?.client.open()
				}}>Open
				</button>
				<button onClick={() => {
					ws?.client.close()
				}}>Close
				</button>
				<button onClick={() => {
					ws?.client.breakConnection()
				}}>Disconect
				</button>
				<button onClick={() => {
					console.log('ws?.client.getStoredRequests()', ws?.client.getStoredRequests())
				}}>GEt
				</button>

				<hr/>
				<button onClick={() => {
					ws?.client.sendMessage(JSON.stringify('Привет'))
				}}>Привет</button>
				<button onClick={() => {
					ws?.client.sendMessage('subscribe.NO')
				}}>subscribe.NO</button>
				<h3>Subscribe</h3>
				<button onClick={() => {
					ws?.client.subscribe(Sub1)
				}}>Sub1</button>
				<button onClick={() => {
					ws?.client.subscribe(Sub2)
				}}>Sub2</button>
				<button onClick={() => {
					ws?.client.subscribe(Sub3)
				}}>Sub3</button>
				<h3>Unsubscribe</h3>
				<button onClick={() => {
					ws?.client.removeStoreKey(Sub1)
					ws?.client.unsubscribe('un'+Sub1)
				}}>UnSub1</button>
				<button onClick={() => {
					ws?.client.removeStoreKey(Sub2)
					ws?.client.unsubscribe('un'+Sub2)
				}}>UnSub2</button>
				<button onClick={() => {
					ws?.client.removeStoreKey(Sub3)
					ws?.client.unsubscribe('un'+Sub3)
				}}>UnSub3</button>

				<hr/>
				Status: {ws?.info.conn?.status || '—'}
			</div>
		</Container>
	)
};
