import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

const responseSchema = z.array(
	z.object({
		id: z.string().uuid(),
		user_id: z.string().uuid(),
		friend_id: z.string().uuid(),
		created_at: z.coerce.date(),
	})
);

export type ListingUserFriendsResponse = z.infer<typeof responseSchema>;

export const listingUserFriendsResponseSchema: FastifySchema = {
	tags: ['Friendships'],
	summary: 'Listing all users friends',
	security: [{ bearerAuth: [] }],
	response: {
		200: responseSchema,
	},
};
