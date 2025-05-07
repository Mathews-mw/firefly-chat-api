import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';
import { userSchema } from '../user/user-schema';
import { paginationResponseSchema } from '../pagination-schema';

const querySchema = z.object({
	page: z.optional(z.coerce.number()).default(1),
	per_page: z.optional(z.union([z.literal('all'), z.coerce.number()])).default(10),
	search: z.optional(z.string()),
});

const responseSchema = z.object({
	pagination: paginationResponseSchema,
	friends: z.array(
		z.object({
			id: z.string().uuid(),
			user_id: z.string().uuid(),
			friend_id: z.string().uuid(),
			created_at: z.coerce.date(),
			friend: userSchema,
		})
	),
});

export type ListingUserFriendsQuery = z.infer<typeof querySchema>;
export type ListingUserFriendsResponse = z.infer<typeof responseSchema>;

export const listingUserFriendsResponseSchema: FastifySchema = {
	tags: ['Friendships'],
	summary: 'Listing all users friends',
	security: [{ bearerAuth: [] }],
	querystring: querySchema,
	response: {
		200: responseSchema,
	},
};
