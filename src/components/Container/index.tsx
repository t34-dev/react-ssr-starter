import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';

import s from './index.module.scss';

interface ContainerProps {
  className?: string;
}

export const Container: FC<PropsWithChildren<ContainerProps>> = ({
  className,
  children,
}) => {
  return <div className={clsx(s.wrap, className)}>{children}</div>;
};
