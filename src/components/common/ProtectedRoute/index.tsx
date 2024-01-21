import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  children?: React.ReactElement;
  isAllowed: boolean;
  redirectTo: string;
}

export default function ProtectedRoute({
  children,
  isAllowed,
  redirectTo = '/login',
}: ProtectedRouteProps): React.ReactElement | null {
  if (!isAllowed) {
    return <Navigate to={redirectTo} />;
  }
  return children || <Outlet />;
}
