import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

const paramsSchema = z.object({
	invitationId: z.string().uuid(),
});

const responseSchema = z.object({
	message: z.string(),
});

export type DeleteInvitationParams = z.infer<typeof paramsSchema>;
export type DeleteInvitationResponse = z.infer<typeof responseSchema>;

export const deleteInvitationSchema: FastifySchema = {
	tags: ['Friendships'],
	summary: 'Delete an invitation',
	security: [{ bearerAuth: [] }],
	params: paramsSchema,
	response: {
		200: responseSchema,
	},
};
