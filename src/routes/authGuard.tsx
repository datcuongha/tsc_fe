import { Navigate } from 'react-router-dom';

import { useAuth } from 'src/context/authContext';

import { showAlert } from 'src/components/alert';

export const AuthGuard = ({ children, roles }: any) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  // ❌ chưa login
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }
  const role = Number(user?.data?.vaiTroId ?? user?.vaiTroId);
  
  // ❌ không đủ quyền
  if (roles && !roles.includes(role)) {
    showAlert({ message: 'Bạn không có quyền truy cập', type: 'error' });
    return <Navigate to="/" replace />;
  }

  return children;
};
