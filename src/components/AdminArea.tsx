import { AuthProvider } from '../contexts/AuthContext';
import AdminRoute from './AdminRoute';
import Dashboard from '../pages/Dashboard';

export default function AdminArea() {
  return (
    <AuthProvider>
      <AdminRoute>
        <Dashboard />
      </AdminRoute>
    </AuthProvider>
  );
}
