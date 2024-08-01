import { NewLayout } from './layouts';
import { useRoutes } from 'react-router-dom';
import { routes } from '@/routes.tsx';
import { useEffect } from 'react';
import { useMainSocket } from '@/hooks/useWebSocket/MainSocket/useMainSocket.ts';

export const App = () => {
	const { connect: connectMainSocket } = useMainSocket();
	const routeElement = useRoutes(routes);

	useEffect(() => {
		connectMainSocket();
	}, []);

	return <NewLayout>{routeElement}</NewLayout>;
};
