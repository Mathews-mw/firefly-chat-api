import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';
import { invitationStatusSchema } from '@/domains/chat/models/entities/invitation';

const querySchema = z.object({
	status: z.optional(invitationStatusSchema),
});

const responseSchema = z.object({
	amount: z.coerce.number(),
});

export type UserInvitationsAmountQuery = z.infer<typeof querySchema>;
export type UserInvitationsAmountResponse = z.infer<typeof responseSchema>;

export const userInvitationsAmountSchema: FastifySchema = {
	tags: ['Friendships'],
	summary: 'Accept an invitation',
	security: [{ bearerAuth: [] }],
	querystring: querySchema,
	response: {
		200: responseSchema,
	},
};
