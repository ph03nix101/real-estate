import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAgent?: boolean;
}

export default function ProtectedRoute({ children, requireAgent = false }: ProtectedRouteProps) {
    const { isAuthenticated, isAgent, loading } = useAuth();

    // Show nothing while checking auth status
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Requires agent but user is not an agent
    if (requireAgent && !isAgent) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
