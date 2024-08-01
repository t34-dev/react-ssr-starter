import { FC } from 'react';

import s from './index.module.scss';
import { Container } from '@/components';
import { Store } from '@/zustand';
import { WebSocketV3PageItem } from '@pages/_/WebSocketV3Page/inside/WebSocketV3PageItem';

export const WebSocketV3Page: FC = () => {
	const { pong } = Store.app.use();
	return (
		<div className={s.wrap}>
			<Container>
				<div className={s.wrap__box}>
					<button
						onClick={() => {
							Store.app.set({
								pong: !pong,
							});
						}}
					>
						<b>PONG:</b> {pong ? 'Включен' : 'Отключен'}
					</button>

					<WebSocketV3PageItem />
				</div>
			</Container>
		</div>
	);
};
