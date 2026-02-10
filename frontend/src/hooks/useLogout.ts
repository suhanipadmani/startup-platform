import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logout } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';

export function useLogout() {
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
        } catch {
            
        }

        localStorage.removeItem('token');
        setUser(null);
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return handleLogout;
}
