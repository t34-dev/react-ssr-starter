import { FC, useEffect } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

import s from './index.module.scss';
import { Container } from '@/components';
import { ENV } from '@/env.ts';

interface Item {
	id: string;
	name: string;
}

const fetchItems = async (): Promise<Item[]> => {
	const response = await axios.get<Item[]>('/api/items');
	return response.data as Promise<Item[]>;
};

export const HomePage: FC = () => {
	const {
		data: items,
		isLoading,
		isError,
		refetch,
	} = useQuery<Item[]>('items', fetchItems);

	useEffect(() => {
		console.log(import.meta.env);
	}, []);
	return (
		<div className={s.wrap}>
			<Container>
				<h1>HomePage, SSR: {ENV.SSR ? 'True' : 'False'}</h1>
				<button onClick={() => refetch()}>Load Items</button>
				{isLoading && <p>Loading...</p>}
				{isError && <p>Error loading items</p>}
				{items && (
					<ul>
						{items.map((item) => (
							<li key={item.id}>{item.name}</li>
						))}
					</ul>
				)}
			</Container>
		</div>
	);
};
