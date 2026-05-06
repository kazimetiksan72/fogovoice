import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute({ type }) {
  const token = localStorage.getItem(type === 'admin' ? 'adminToken' : 'guideToken');
  const redirect = type === 'admin' ? '/admin/login' : '/guide/login';
  return token ? <Outlet /> : <Navigate to={redirect} replace />;
}
