import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { LoginPayload, RegisterPayload } from '../types/auth.ts';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toast';

export const useAuth = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: user, isLoading: isLoadingUser } = useQuery({
        queryKey: ['auth', 'user'],
        queryFn: authService.getMe,
        retry: false,
        staleTime: 5 * 60 * 1000,
        enabled: !!localStorage.getItem('token'),
    });

    const loginMutation = useMutation({
        mutationFn: (data: LoginPayload) => authService.login(data),
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            queryClient.setQueryData(['auth', 'user'], data.user);
            showToast.success('Logged in successfully');
            navigate(data.user.role === 'admin' ? '/admin' : '/founder');
        },
    });

    const registerMutation = useMutation({
        mutationFn: (data: RegisterPayload) => authService.register(data),
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            queryClient.setQueryData(['auth', 'user'], data.user);
            showToast.success('Registered successfully');
            navigate('/founder');
        },
    });

    const logoutMutation = useMutation({
        mutationFn: authService.logout,
        onSettled: () => {
            localStorage.removeItem('token');
            queryClient.setQueryData(['auth', 'user'], null);
            navigate('/login');
            showToast.success('Logged out successfully');
        },
    });

    return {
        user,
        isLoadingUser,
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        register: registerMutation.mutate,
        isRegistering: registerMutation.isPending,
        logout: logoutMutation.mutate,
    };
};
