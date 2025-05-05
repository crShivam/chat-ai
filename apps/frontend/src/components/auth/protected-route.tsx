import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import Loader from '../common/loader';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    toast.error('Authentication required');
    return <Navigate to={'/auth'} replace />;
  }

  // User is authenticated
  return <>{children}</>;
}
