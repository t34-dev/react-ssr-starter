import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type AppStore = {
	initApp?: boolean;
	loadingFly?: boolean;
	testCount: number;
	testCountStore: number;
	pong: boolean;
};

const keyName = 'appStore';

const defaultAppStore = (): AppStore => ({
	testCount: 0,
	testCountStore: 0,
	pong: true,
});

export const useAppStore = create(
	devtools(
		persist<AppStore>(defaultAppStore, {
			name: keyName,
			partialize: (state) =>
				({
					testCountStore: state.testCountStore,
					pong: state.pong,
				}) as AppStore,
		}),
		{
			name: keyName,
		},
	),
);

export const setAppStore = (data: Partial<AppStore>) => {
	const existing = useAppStore.getState() ?? {};

	const newData = {
		...existing,
		...data,
	};
	useAppStore.setState(newData);
};

export const resetAppStore = () => {
	useAppStore.persist.clearStorage();
	const state = useAppStore.getState();

	useAppStore.setState(
		Object.keys(state).reduce(
			(p, c) => ({
				...p,
				[c]: undefined,
			}),
			{},
		),
	);

	useAppStore.setState(defaultAppStore());
};

export const AppStore = {
	keyName,
	set: setAppStore,
	use: useAppStore,
	getState: useAppStore.getState,
	reset: resetAppStore,
};
