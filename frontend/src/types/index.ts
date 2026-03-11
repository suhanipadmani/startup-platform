export type Role = 'admin' | 'founder';

export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: string;
    updatedAt?: string;
}

export type User = IUser;

export type ProjectStatus = 'pending' | 'approved' | 'rejected';

export interface IProjectIdea {
    _id: string;
    founderId: string | IUser;
    title: string;
    problemStatement: string;
    solution: string;
    targetMarket: string;
    techStack: string[];
    teamDetails: string;
    pitchDeckUrl?: string;
    documents?: Array<{
        name: string;
        url: string;
        uploadedAt: string;
    }>;
    status: ProjectStatus;
    adminComment?: string;
    createdAt: string;
    updatedAt: string;
}

export interface IPaginatedResponse<T> {
    docs: T[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
}

export interface IdeaFilters {
    status?: string;
    tech?: string;
    search?: string;
    page?: number;
    limit?: number;
}
