import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { Role } from '../../types';
import type { JSX } from 'react';

interface RoleGuardProps {
    children: JSX.Element;
    role: Role;
}

const RoleGuard = ({ children, role }: RoleGuardProps) => {
    const { user, isLoadingUser } = useAuth();

    if (isLoadingUser) return null;

    if (!user || user.role !== role) {
        if (user?.role === 'admin') return <Navigate to="/admin" replace />;
        if (user?.role === 'founder') return <Navigate to="/founder" replace />;
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default RoleGuard;
