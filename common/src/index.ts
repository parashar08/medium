import { z } from "zod";

export const signupInput = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
    name: z.string().min(3).max(100).optional(),
});

export const loginInput = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
});


export const createBlogInput = z.object({
    title: z.string(),
    content: z.string(),
});

export const updateBlogInput = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    id: z.string(),
});


export type SingupInput = z.infer<typeof signupInput>;
export type LoginInput = z.infer<typeof loginInput>;
export type CreateBlogInput = z.infer<typeof createBlogInput>;
export type UpdateBlogInput = z.infer<typeof updateBlogInput>;
