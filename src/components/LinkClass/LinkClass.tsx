import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';
import { LinkProps, NavLink } from 'react-router-dom';

interface ILinkProps extends Omit<LinkProps, 'className'> {
  className?: string;
  classNameActive?: string;
}

export const LinkClass: FC<PropsWithChildren<ILinkProps>> = ({
  to,
  className,
  classNameActive,
  children,
  ...rest
}) => {
  return (
    <NavLink
      to={to}
      {...rest}
      className={({ isActive }) => clsx(className, isActive && classNameActive)}
    >
      {children}
    </NavLink>
  );
};
