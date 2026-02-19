import api from './api';
import type { IProjectIdea, IPaginatedResponse } from '../types';

export const ideaService = {
    getAllIdeas: async (params?: any) => {
        const response = await api.get<IProjectIdea[] | IPaginatedResponse<IProjectIdea>>('/ideas', { params });
        return response.data;
    },

    getAdminIdeas: async (params?: any) => {
        const response = await api.get<IPaginatedResponse<IProjectIdea>>('/admin/ideas', { params });
        return response.data;
    },

    getIdeaStats: async () => {
        const response = await api.get<{ total: number; pending: number; approved: number; rejected: number }>('/ideas/stats');
        return response.data;
    },

    getIdeaById: async (id: string) => {
        const response = await api.get<IProjectIdea>(`/ideas/${id}`);
        return response.data;
    },

    createIdea: async (data: Partial<IProjectIdea>) => {
        const response = await api.post<IProjectIdea>('/ideas', data);
        return response.data;
    },

    updateIdea: async (id: string, data: Partial<IProjectIdea>) => {
        const response = await api.put<IProjectIdea>(`/ideas/${id}`, data);
        return response.data;
    },

    deleteIdea: async (id: string) => {
        const response = await api.delete(`/ideas/${id}`);
        return response.data;
    },

    // Admin
    approveIdea: async (id: string, comment: string) => {
        const response = await api.put(`/admin/ideas/${id}/approve`, { comment });
        return response.data;
    },

    rejectIdea: async (id: string, comment: string) => {
        const response = await api.put(`/admin/ideas/${id}/reject`, { comment });
        return response.data;
    }
};
