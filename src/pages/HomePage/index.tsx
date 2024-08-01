import { FC, useEffect } from 'react';

import s from './index.module.scss';
import { Container } from '@/components';

export const HomePage: FC = () => {
	useEffect(() => {
		console.log(1111);
	}, []);
	return (
		<div className={s.wrap}>
			<Container>HomePage</Container>
		</div>
	);
};
