import { api } from './axios';
import type { ProjectIdea, PaginatedResponse } from '../types';

export const myProjects = (search: string = '', page: number = 1, limit: number = 10) =>
    api.get<PaginatedResponse<ProjectIdea>>('/projects/my', {
        params: { search, page, limit }
    });

export const adminProjects = (
    q: string,
    page: number
) =>
    api.get<PaginatedResponse<ProjectIdea>>(`/admin/projects?search=${q}&page=${page}`);

export const reviewProject = (
    id: string,
    action: string,
    comment: string
) =>
    api.put(`/admin/projects/${id}/${action}`, { comment });