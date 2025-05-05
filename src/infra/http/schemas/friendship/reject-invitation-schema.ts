import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

const paramsSchema = z.object({
	invitationId: z.string().uuid(),
});

const responseSchema = z.object({
	message: z.string(),
});

export type RejectInvitationParams = z.infer<typeof paramsSchema>;
export type RejectInvitationResponse = z.infer<typeof responseSchema>;

export const rejectInvitationSchema: FastifySchema = {
	tags: ['Friendships'],
	summary: 'Reject an invitation',
	security: [{ bearerAuth: [] }],
	params: paramsSchema,
	response: {
		200: responseSchema,
	},
};
