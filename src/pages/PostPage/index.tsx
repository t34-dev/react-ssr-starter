import clsx from 'clsx';
import { FC, useMemo } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { Service } from '@/react-query';
import { setAppStore, Store } from '@/zustand';

import s from './index.module.scss';
import { usePageTitle } from '@/hooks';

export const PostPage: FC = () => {
	const { testCountStore } = Store.app.use();
	const navigate = useNavigate();
	const updatePost = useMutation(Service.posts.updatePost());
	const params = useParams<{ id?: string }>();
	const id = useMemo(() => Number(params?.id), [params?.id]);

	const {
		data: post,
		isFetching,
		refetch,
	} = useQuery({
		...Service.posts.getById({
			id,
		}),
		enabled: !isNaN(id),
	});
	usePageTitle(post?.title);

	const handleUpdateData = async () => {
		if (isNaN(id)) return;
		await updatePost.mutateAsync({
			id,
			data: {
				...post,
				title: 'UPDATED',
			},
		});
	};

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
						{post ? (
							<ul className={s.list}>
								<li>
									<u>ID:</u> {post.id}
								</li>
								<li>
									<u>Title:</u> {post.title}
								</li>
								<li>
									<u>Body:</u> {post.body}
								</li>
							</ul>
						) : (
							<div>NONE</div>
						)}
					</>
				)}
			</div>
			<div className={s.wrap__bottom}>
				<button onClick={() => navigate(-1)}>Back</button>
				<button onClick={() => refetch()}>Get Data</button>
				<button onClick={() => handleUpdateData()}>Update Data</button>
			</div>
		</div>
	);
};
