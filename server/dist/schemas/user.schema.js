// src/schemas/user.schema.ts
import { z } from 'zod';
export const createUserSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        address: z.string().optional(),
    }),
});
export const updateUserSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required").optional(),
        email: z.string().email("Invalid email address").optional(),
        address: z.string().optional(),
    }),
});
