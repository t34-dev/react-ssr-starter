import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
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
	return response.data;
};

export const HomePage: FC = () => {
	const {
		data: items = [],
		isLoading,
		isError,
		refetch,
	} = useQuery<Item[]>({
		queryKey: ['items'],
		queryFn: fetchItems,
	});

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
