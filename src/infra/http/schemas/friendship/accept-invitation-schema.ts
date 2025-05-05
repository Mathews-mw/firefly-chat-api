import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

const paramsSchema = z.object({
	invitationId: z.string().uuid(),
});

const responseSchema = z.object({
	message: z.string(),
});

export type AcceptInvitationParams = z.infer<typeof paramsSchema>;
export type AcceptInvitationResponse = z.infer<typeof responseSchema>;

export const acceptInvitationSchema: FastifySchema = {
	tags: ['Friendships'],
	summary: 'Accept an invitation',
	security: [{ bearerAuth: [] }],
	params: paramsSchema,
	response: {
		200: responseSchema,
	},
};
