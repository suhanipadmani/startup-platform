import { api } from './axios';

export const getSystemStats = async () => {
    const response = await api.get('/admin/analytics/stats');
    return response.data;
};

export const getGrowthStats = async () => {
    const response = await api.get('/admin/analytics/growth');
    return response.data;
};
