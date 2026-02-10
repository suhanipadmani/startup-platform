import { api } from './axios';

export const login = (data: any) => api.post('/auth/login', data);
export const register = (data: any) => api.post('/auth/register', data);
export const me = () => api.get('/auth/me');
export const logout = () => api.post('/auth/logout');