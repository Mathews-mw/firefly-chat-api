import { rolesSchema } from '@/core/auth/roles';
import { z } from 'zod';

export const userSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	email: z.string().email(),
	username: z.string().nullable(),
	role: rolesSchema,
	avatar_url: z.string().url().nullable(),
	is_active: z.boolean(),
	created_at: z.coerce.date(),
});

export type UserResponse = z.infer<typeof userSchema>;
