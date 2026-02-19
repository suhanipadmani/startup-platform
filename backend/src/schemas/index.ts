import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        role: z.enum(['founder', 'admin']).optional(),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
    }),
});

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
    }),
});

export const resetPasswordSchema = z.object({
    body: z.object({
        password: z.string().min(6, 'Password must be at least 6 characters'),
    }),
    params: z.object({
        token: z.string(),
    }),
});

export const changePasswordSchema = z.object({
    body: z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    }),
});

export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        email: z.string().email().optional(),
    }),
});

export const reviewSchema = z.object({
    body: z.object({
        comment: z.string().min(1, 'Comment is required'),
    }),
});

export const updateUserSchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        email: z.string().email().optional(),
        role: z.enum(['founder', 'admin']).optional(),
    }),
    params: z.object({
        id: z.string(),
    }),
});

export const ideaSchema = z.object({
    body: z.object({
        title: z.string().min(5),
        problemStatement: z.string().min(20),
        solution: z.string().min(20),
        targetMarket: z.string().min(5),
        techStack: z.array(z.string()).min(1),
    }),
});
