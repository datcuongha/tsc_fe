// import { Navigate, useLocation } from 'react-router-dom';

// import { useAuth } from 'src/context/authContext';

// import { showAlert } from 'src/components/alert';

// export const AuthGuard = ({ children, roles }: any) => {
//   const { user, loading } = useAuth();
//   const location = useLocation();
//   if (loading) return null;
//   // ❌ chưa login
//   if (!user) {
//     return <Navigate to="/sign-in" state={{ from: location }} replace />;
//   }
//   const role = Number(user?.data?.vaiTroId ?? user?.vaiTroId);

//   // ❌ không đủ quyền
//   if (roles && !roles.includes(role)) {
//     showAlert({ message: 'Bạn không có quyền truy cập', type: 'error' });
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };
import type { ReactNode } from 'react';

import { Navigate } from 'react-router-dom';

type AuthGuardProps = {
  children: ReactNode;
  permissions?: string[];
  requireAll?: boolean;
};

type TokenUser = {
  userId: number;
  vaiTroId?: number | null;
  email?: string | null;
  logo?: string | null;
  fullName?: string | null;
  authType?: string | null;
  permissions?: string[];
};

type TokenPayload = {
  data?: TokenUser;
  iat?: number;
  exp?: number;
};

const getAccessToken = () => localStorage.getItem('accessToken') ?? localStorage.getItem('token');

const decodeToken = (token: string): TokenPayload | null => {
  try {
    const payloadPart = token.split('.')[1];

    if (!payloadPart) {
      return null;
    }

    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');

    const padding = '='.repeat((4 - (normalized.length % 4)) % 4);

    const binary = window.atob(normalized + padding);

    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

    const json = new TextDecoder().decode(bytes);

    return JSON.parse(json) as TokenPayload;
  } catch (error) {
    console.error('Không thể đọc access token:', error);

    return null;
  }
};

const clearAuthStorage = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

export const getCurrentUser = (): TokenUser | null => {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  const payload = decodeToken(token);

  if (!payload?.data?.userId) {
    return null;
  }

  if (payload.exp && payload.exp * 1000 <= Date.now()) {
    return null;
  }

  return payload.data;
};

export const getUserPermissions = (): string[] => getCurrentUser()?.permissions ?? [];

export const hasPermission = (permission: string): boolean =>
  getUserPermissions().includes(permission);

export function AuthGuard({ children, permissions = [], requireAll = true }: AuthGuardProps) {
  const token = getAccessToken();
  const payload = token ? decodeToken(token) : null;

  const user = payload?.data;

  if (!token || !user?.userId) {
    clearAuthStorage();

    return <Navigate to="/sign-in" replace />;
  }

  if (payload?.exp && payload.exp * 1000 <= Date.now()) {
    clearAuthStorage();

    return <Navigate to="/sign-in" replace />;
  }

  if (permissions.length === 0) {
    return children;
  }

  const userPermissions = user.permissions ?? [];

  const allowed = requireAll
    ? permissions.every((permission) => userPermissions.includes(permission))
    : permissions.some((permission) => userPermissions.includes(permission));

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return children;
}
