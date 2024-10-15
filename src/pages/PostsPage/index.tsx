import clsx from 'clsx';
import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { Service } from '@/react-query';
import { setAppStore, Store } from '@/zustand';

import s from './index.module.scss';
import { usePageTitle } from '@/hooks';
import { getTitleFromRoute, ROUTES } from '@/routes.tsx';

export const PostsPage: FC = () => {
	const { testCountStore } = Store.app.use();
	usePageTitle(getTitleFromRoute(ROUTES.posts));

	const {
		data: posts,
		isFetching,
		refetch,
	} = useQuery({
		...Service.posts.getAll({}),
	});

	return (
		<div className={s.wrap}>
			<div className={clsx(s.box, s.wrap__content)}>
				<div
					className={s.box__top}
					onClick={() =>
						setAppStore({
							testCountStore: testCountStore + 1,
						})
					}
				>
					<h2 className={s.h1}>Posts {testCountStore}</h2>
				</div>
				{isFetching ? (
					<div style={{ padding: '1.6rem' }}>Loading...</div>
				) : (
					<>
						{posts?.map((post) => (
							<Link
								to={
									ROUTES.postDetail.path?.replace(':id', String(post.id)) || ''
								}
								className={s.list}
								key={post.id}
							>
								<li>
									<u>ID:</u> {post.id}
								</li>
								<li>
									<u>Title:</u> {post.title}
								</li>
								<li>
									<u>Body:</u> {post.body}
								</li>
							</Link>
						))}
					</>
				)}
			</div>
			<div className={s.wrap__bottom}>
				<button onClick={() => refetch()}>Get Data</button>
			</div>
		</div>
	);
};
