import { FC } from 'react';

import { resetAppStore, setAppStore, useAppStore } from '@/zustand';

import s from './index.module.scss';

export const ZustandPage: FC = () => {
  const { testCount, testCountStore } = useAppStore();

  return (
    <div className={s.wrap}>
      <div className={s.wrap__bottom}>
        <button onClick={() => setAppStore({ testCount: testCount + 1 })}>
          {testCount}
        </button>
        <button
          onClick={() => setAppStore({ testCountStore: testCountStore + 1 })}
        >
          {testCountStore}
        </button>
      </div>
      <button onClick={() => resetAppStore()}>ResetStore</button>
    </div>
  );
};
