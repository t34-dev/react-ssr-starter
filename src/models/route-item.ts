import { RouteProps } from 'react-router-dom';

export type RouteItem<ExtraProps = object> = {
  path: string;
  name: string;
} & Pick<RouteProps, 'element'> &
  ExtraProps;
