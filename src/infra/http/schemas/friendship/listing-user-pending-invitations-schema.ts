import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { userSchema } from '../user/user-schema';
import { invitationStatusSchema } from '@/domains/chat/models/entities/invitation';

const responseSchema = z.array(
	z.object({
		id: z.string().uuid(),
		sender_id: z.string().uuid(),
		receiver_id: z.string().uuid(),
		status: invitationStatusSchema,
		replied_at: z.coerce.date().nullable(),
		created_at: z.coerce.date(),
		sender: userSchema,
	})
);

export type ListingUserPendingInvitationsResponse = z.infer<typeof responseSchema>;

export const listingUserPendingInvitationsResponseSchema: FastifySchema = {
	tags: ['Friendships'],
	summary: 'Listing all users pending invitations',
	security: [{ bearerAuth: [] }],
	response: {
		200: responseSchema,
	},
};
