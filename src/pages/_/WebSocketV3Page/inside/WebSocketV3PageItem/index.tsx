import { FC } from 'react';

import s from './index.module.scss';
import clsx from 'clsx';
import { useMainSocket } from '@/hooks/useWebSocket/MainSocket/useMainSocket.ts';
import {
	SocketSubMessageAssetDTO,
	SocketSubMessageMarketDTO,
} from '@/hooks/useWebSocket/MainSocket/types.ts';

interface WebSocketV3PageItemProps {}

export const WebSocketV3PageItem: FC<WebSocketV3PageItemProps> = () => {
	const {
		client,
		connect,
		stop,
		disconnect,
		connectInfo,
		sendMessage,
		subscribe,
	} = useMainSocket();
	const url = client?.url || 'EMPTY';

	return (
		<div className={s.item}>
			<h3>
				Socket!: <u>{url}</u>
			</h3>
			<div>
				Статус:{' '}
				<b className={clsx(s?.[`color__${connectInfo?.conn?.status}`])}>
					{connectInfo?.conn?.status || 'DONT INIT'}
				</b>
				<div>
					<u>{url}</u>
				</div>
			</div>
			<div className={s.item__actions}>
				<button
					onClick={() => {
						connect();
					}}
				>
					OPEN
				</button>
				<button
					onClick={() => {
						stop();
					}}
				>
					CLOSE
				</button>
				<button
					onClick={() => {
						disconnect();
					}}
				>
					DISCONNECT
				</button>
			</div>
			<div className={s.item__actions}>
				<button
					onClick={() => {
						const v1: SocketSubMessageMarketDTO = {
							op: 'getMarkets',
							args: {
								cat: 'test',
								value: 1000,
								name: 'sdds',
							},
						};
						const v2: SocketSubMessageAssetDTO = {
							op: 'getAssets',
						};
						sendMessage([v1, v2], (res) => {
							res.forEach((elem) => {
								switch (elem.op) {
									case 'getMarkets': {
										const v1 = elem.data?.markets || [];
										console.log('getMarkets', v1, elem);
										break;
									}
									case 'getAssets': {
										const v1 = elem.data?.assets || [];
										console.log('getAssets', v1, elem);
										break;
									}
								}
							});
						});
					}}
				>
					Message1
				</button>
				{/*<button onClick={()=>{*/}
				{/*	sendMessage('sendMessage',{*/}
				{/*		name: 'zakon',*/}
				{/*	}, async ({res,err}) => {*/}
				{/*		console.log("test1", {res, err})*/}
				{/*	})*/}
				{/*}}>Message2</button>*/}
				{/*<button onClick={()=>{*/}
				{/*	sendMessage('sendMessage',undefined, async ({res, err}) => {*/}
				{/*		console.log("test2", {res, err})*/}
				{/*	})*/}
				{/*	sendMessage('sendMessage',null, async ({res, err}) => {*/}
				{/*		console.log("test3", {res, err})*/}
				{/*	})*/}
				{/*	sendMessage('sendMessage',null, async ({res, err}) => {*/}
				{/*		console.log("test4", {res, err})*/}
				{/*	})*/}
				{/*}}>Message3</button>*/}
			</div>
			<dl>
				<dt>Subscribe</dt>
				<dd>
					<div className={s.item__actions}>
						<button
							onClick={() =>
								subscribe(['markets.BTN.10min', 'Test'], async (res) => {
									console.log('Подписка', { req, res }, req.op, req.args);
								})
							}
						>
							Subsctibe/markets
						</button>
						<button onClick={() => unsubscribe(['markets'])}>
							Unsubsctibe/markets
						</button>
					</div>
					{/*<div className={s.item__actions}>*/}
					{/*	<button onClick={() => subscribe('orders')}>Subsctibe/orders</button>*/}
					{/*	<button onClick={() => unsubscribe('orders')}>Unsubsctibe/orders</button>*/}
					{/*</div>*/}
					{/*<div className={s.item__actions}>*/}
					{/*	<button onClick={() => subscribe('history')}>Subsctibe/history</button>*/}
					{/*	<button onClick={() => unsubscribe('history')}>Unsubsctibe/history</button>*/}
					{/*</div>*/}
				</dd>
			</dl>
		</div>
	);
};
