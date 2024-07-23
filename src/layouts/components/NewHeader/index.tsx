import {Container, LinkClass} from '@/components';

import s from './index.module.scss';
import {ROUTES} from "@/routes.tsx";
import {useMainSocket} from "@/hooks/useWebSocket/MainSocket/useMainSocket.ts";
import clsx from "clsx";
export const NewHeader = () => {
	const {connectInfo} = useMainSocket()
  return (
    <nav className={s.wrap}>
      <Container>
				<div className={s.menu}>
					<div className={s.menu__left}>
						<LinkClass to={ROUTES.home.path} className={s.menu__item} classNameActive={s.menu__itemActive}>Home</LinkClass>
						<LinkClass to={ROUTES.socket.path} className={s.menu__item} classNameActive={s.menu__itemActive}>Socket</LinkClass>
						<LinkClass to={ROUTES.socket_v3.path} className={s.menu__item} classNameActive={s.menu__itemActive}>Socket V3</LinkClass>
					</div>
					<div className={s.menu__right}>
						MainSocket: <span className={clsx(s.status, s?.[`status__${connectInfo?.conn?.status}`])}/>
					</div>
				</div>
			</Container>
    </nav>
  );
};
