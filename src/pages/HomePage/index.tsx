import {FC} from 'react';

import s from './index.module.scss';
import {Container} from '@/components';

export const HomePage: FC = () => {
  return (
    <div className={s.wrap}>
      <Container>
				HomePage
      </Container>
    </div>
  );
};
