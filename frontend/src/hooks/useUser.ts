import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import type { IUser } from '../types';
import { showToast } from '../utils/toast';
import { useNavigate } from 'react-router-dom';

export const useUser = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const updateProfileMutation = useMutation({
        mutationFn: (data: Partial<IUser>) => userService.updateProfile(data),
        onSuccess: (data) => {
            queryClient.setQueryData(['auth', 'user'], data);
            showToast.success('Profile updated successfully');
            navigate('/profile');
        },
    });

    const changePasswordMutation = useMutation({
        mutationFn: (data: any) => userService.changePassword(data),
        onSuccess: () => {
            showToast.success('Password changed successfully');
            navigate('/profile');
        },
    });

    const deleteAccountMutation = useMutation({
        mutationFn: () => userService.deleteAccount(),
        onSuccess: () => {
            localStorage.removeItem('token');
            queryClient.clear();
            showToast.success('Account deleted successfully');
            navigate('/login');
        },
    });

    return {
        updateProfile: updateProfileMutation.mutate,
        isUpdating: updateProfileMutation.isPending,
        changePassword: changePasswordMutation.mutate,
        isChangingPassword: changePasswordMutation.isPending,
        deleteAccount: deleteAccountMutation.mutate,
        isDeletingAccount: deleteAccountMutation.isPending,
    };
};
