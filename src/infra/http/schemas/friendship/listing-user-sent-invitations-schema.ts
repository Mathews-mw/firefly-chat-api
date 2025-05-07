import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { invitationStatusSchema } from '@/domains/chat/models/entities/invitation';
import { userSchema } from '../user/user-schema';

const responseSchema = z.array(
	z.object({
		id: z.string().uuid(),
		sender_id: z.string().uuid(),
		receiver_id: z.string().uuid(),
		status: invitationStatusSchema,
		replied_at: z.coerce.date().nullable(),
		created_at: z.coerce.date(),
		receiver: userSchema,
	})
);

export type ListingUserSentInvitationsResponse = z.infer<typeof responseSchema>;

export const listingUserSentInvitationsResponseSchema: FastifySchema = {
	tags: ['Friendships'],
	summary: 'Listing all users sent invitations',
	security: [{ bearerAuth: [] }],
	response: {
		200: responseSchema,
	},
};
