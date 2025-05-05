import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';
import { invitationStatusSchema } from '@/domains/chat/models/entities/invitation';

const responseSchema = z.array(
	z.object({
		id: z.string().uuid(),
		sender_id: z.string().uuid(),
		receiver_id: z.string().uuid(),
		status: invitationStatusSchema,
		repliedAt: z.coerce.date().nullable(),
		created_at: z.coerce.date(),
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
