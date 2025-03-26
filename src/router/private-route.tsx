import { ErrorState } from '@/components/error-state';
import { useAccess, useCurrentPath } from '@/hooks';
import { useAuth } from '@/hooks/use-auth';
import { flatten, isMatch } from '@/lib/utils';
import { ReactNode, Suspense, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { Navigate, Outlet } from 'react-router-dom';
import routes, { CustomRouteType } from './routes';

type PrivateRouteProps = {
  redirect?: string;
  children?: ReactNode;
};

export const PrivateRoute = ({ redirect = '/sign-in', children }: PrivateRouteProps) => {
  const { t } = useTranslation();

  const routeArr = useMemo(() => flatten(routes.routes[0].children, 'children'), []);
  const currentPath = useCurrentPath();

  const { isAuthenticated } = useAuth();

  const permissions = useMemo(() => {
    const currentRoute = routeArr?.find(route => {
      if (route.path?.includes(':')) {
        return isMatch(route.path || '', currentPath);
      }
      return route.path === currentPath;
    }) as CustomRouteType;
    return currentRoute.permissions;
  }, [currentPath, routeArr]);

  const access = useAccess(permissions);

  if (!isAuthenticated) {
    return <Navigate to={redirect} />;
  }

  if (!access()) {
    return <Navigate to="/403" />;
  }

  return (
    <ErrorBoundary fallback={<ErrorState text={t('content.privateRouteState')} />}>
      <Suspense>{children || <Outlet />}</Suspense>
    </ErrorBoundary>
  );
};
