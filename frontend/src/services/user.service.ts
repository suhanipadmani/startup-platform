import api from './api';
import type { IUser } from '../types';

export const userService = {
    updateProfile: async (data: Partial<IUser>) => {
        const response = await api.put<IUser>('/auth/profile', data);
        return response.data;
    },

    changePassword: async (data: any) => {
        const response = await api.put('/auth/change-password', data);
        return response.data;
    },

    deleteAccount: async () => {
        const response = await api.delete('/auth/delete-account');
        return response.data;
    },

    // Admin only
    getAllUsers: async () => {
        const response = await api.get<IUser[]>('/admin/users');
        return response.data;
    },

    deleteUser: async (id: string) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    },

    updateUser: async (id: string, data: Partial<IUser>) => {
        const response = await api.put<IUser>(`/admin/users/${id}`, data);
        return response.data;
    }
};
