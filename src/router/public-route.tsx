import { ErrorState } from '@/components/error-state';
import { useAuth } from '@/hooks/use-auth';
import { ReactNode, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

type PublicRouteProps = {
  children: ReactNode;
};

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { t } = useTranslation();

  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <ErrorBoundary fallback={<ErrorState text={t('content.publicRouteState')} />}>
      <Suspense>{children}</Suspense>
    </ErrorBoundary>
  );
};
