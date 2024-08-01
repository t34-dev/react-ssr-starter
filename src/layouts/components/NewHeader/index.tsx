import { Container, LinkClass } from '@/components';

import s from './index.module.scss';
import { getPathFromRoute, ROUTES } from '@/routes.tsx';
import { useMainSocket } from '@/hooks/useWebSocket/MainSocket/useMainSocket.ts';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

export const NewHeader = () => {
	const { connectInfo } = useMainSocket();
	return (
		<nav className={s.wrap}>
			<Container>
				<div className={s.nav}>
					<NavLink to={'/'} className={s.nav__icon}>
						<img src="/favicon/favicon.svg" alt="site" />
					</NavLink>
					<div className={s.nav__left}>
						<LinkClass
							to={getPathFromRoute(ROUTES.home)}
							className={s.menu__item}
							classNameActive={s.menu__itemActive}
						>
							Home
						</LinkClass>
						<LinkClass
							to={getPathFromRoute(ROUTES.socket)}
							className={s.menu__item}
							classNameActive={s.menu__itemActive}
						>
							Socket
						</LinkClass>
						<LinkClass
							to={getPathFromRoute(ROUTES.socket_v3)}
							className={s.menu__item}
							classNameActive={s.menu__itemActive}
						>
							Socket V3
						</LinkClass>
					</div>
					<div className={s.nav__right}>
						MainSocket:{' '}
						<span
							className={clsx(
								s.status,
								s?.[`status__${connectInfo?.conn?.status}`],
							)}
						/>
					</div>
				</div>
			</Container>
		</nav>
	);
};
