import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { rolesSchema } from '@/core/auth/roles';
import { userSchema } from './user-schema';

const responseSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	email: z.string().email(),
	username: z.string().nullable(),
	role: rolesSchema,
	avatar_url: z.string().url().nullable(),
	is_active: z.boolean(),
	created_at: z.coerce.date(),
});

export type GetUserProfileResponse = z.infer<typeof responseSchema>;

export const getUserProfileSchema: FastifySchema = {
	tags: ['Users'],
	summary: 'Get user profile',
	description: 'User needs to be authenticated to get profile info',
	security: [{ bearerAuth: [] }],
	response: {
		200: responseSchema,
	},
};
