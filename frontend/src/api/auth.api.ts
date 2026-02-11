import { api } from './axios';

export const login = (data: any) => api.post('/auth/login', data);
export const register = (data: any) => api.post('/auth/register', data);
export const me = () => api.get('/auth/me');
export const logout = () => api.post('/auth/logout');
export const forgotPassword = (data: { email: string }) => api.post('/auth/forgotpassword', data);
export const resetPassword = (token: string, data: { password: string }) => api.put(`/auth/resetpassword/${token}`, data);