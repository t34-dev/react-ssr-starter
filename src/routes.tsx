import { RouteObject } from 'react-router-dom';
import {ErrorPage, HomePage, PostPage, PostsPage, WebSocketPage, WebSocketV3Page, ZustandPage} from '@/pages';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/socket',
    element: <WebSocketPage />,
  },
  {
    path: '/socket-v3',
    element: <WebSocketV3Page />,
  },
  {
    path: '/posts',
    element: <PostsPage />,
  },
  {
    path: '/posts/:id',
    element: <PostPage />,
  },
  {
    path: '/zustand',
    element: <ZustandPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
];

export const ROUTES = {
  home: routes[0],
  socket: routes[1],
  socket_v3: routes[2],
  posts: routes[3],
  postDetail: routes[4],
  zustand: routes[5],
  error: routes[6],
};


// Остальной код остается без изменений
