// src/schemas/query.schema.ts
import { z } from 'zod';

export const querySchema = z.object({
  page: z.string().regex(/^\d+$/, { message: "Page must be a number" }).optional(),
  name: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
});

export type QuerySchema = z.infer<typeof querySchema>;
