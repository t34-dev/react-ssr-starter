import { ZustandPage } from '@pages/ZustandPage';
import { i18n } from '@/i18n';
import {
	ErrorPage,
	HomePage,
	PostPage,
	PostsPage,
	WebSocketPage,
} from '@/pages';
import { WebSocketV3Page } from '@pages/_/WebSocketV3Page';
import { RouteObject } from 'react-router-dom';

export type ExtendedRouteObject = RouteObject & {
	title: string;
	titleLang?: string;
};

export const ROUTES = {
	home: {
		path: '/',
		title: 'Home',
		titleLang: 'pages:home',
		element: <HomePage />,
	} as ExtendedRouteObject,
	socket: {
		path: '/socket',
		title: 'Socket',
		titleLang: 'pages:socket',
		element: <WebSocketPage />,
	} as ExtendedRouteObject,
	socket_v3: {
		path: '/socket-v3',
		title: 'Socket',
		titleLang: 'pages:socket',
		element: <WebSocketV3Page />,
	} as ExtendedRouteObject,
	posts: {
		path: '/posts',
		title: 'Posts',
		titleLang: 'pages:posts_one',
		element: <PostsPage />,
	} as ExtendedRouteObject,
	postDetail: {
		path: '/posts/:id',
		title: 'Post Detail',
		titleLang: 'pages:post_detail',
		element: <PostPage />,
	} as ExtendedRouteObject,
	zustand: {
		path: '/zustand',
		title: 'Zustand',
		titleLang: 'pages:zustand',
		element: <ZustandPage />,
	} as ExtendedRouteObject,
	error: {
		path: '*',
		title: 'Error Page',
		titleLang: 'pages:error',
		element: <ErrorPage />,
	} as ExtendedRouteObject,
};

export type RouteKeys = keyof typeof ROUTES;

export const getTitleFromRoute = (route: ExtendedRouteObject) => {
	return i18n.t(route.titleLang || route.title);
};

// Create an array of routes for use with useRoutes
export const routes: ExtendedRouteObject[] = Object.values(ROUTES);

export const getPathFromRoute = (route: ExtendedRouteObject): string => {
	return route.path || '';
};
