export type Role = 'admin' | 'founder';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

//PROJECT IDEA

export type ProjectStatus = 'pending' | 'approved' | 'rejected';

export interface ProjectIdea {
  _id: string;
  founderId: string;
  title: string;
  problemStatement: string;
  solution: string;
  targetMarket: string;
  techStack: string[];
  status: ProjectStatus;
  adminComment?: string;
  createdAt: string;
  updatedAt: string;
}

//API RESPONSES

export interface PaginatedResponse<T> {
  projects: T[];
  totalPages: number;
  currentPage: number;
}

//AUTH

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
