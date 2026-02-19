import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from '../ui/Loader';

const AuthLayout = () => {
    const { user, isLoadingUser } = useAuth();

    if (isLoadingUser) {
        return <div className="h-screen flex items-center justify-center"><Loader size="lg" /></div>;
    }

    if (user) {
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        return <Navigate to="/founder" replace />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
