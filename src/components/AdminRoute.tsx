import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }: { children: import("react").ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  // Dashboard handles both the login screen and the explicit no-permission state.
  return <>{children}</>;
}
