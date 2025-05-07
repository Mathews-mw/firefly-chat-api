import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

const bodySchema = z.object({
	username: z.string(),
});

const responseSchema = z.object({
	message: z.string(),
	invitation_id: z.string().uuid(),
});

export type SendInvitationRequest = z.infer<typeof bodySchema>;
export type SendInvitationResponse = z.infer<typeof responseSchema>;

export const sendInvitationSchema: FastifySchema = {
	tags: ['Friendships'],
	summary: 'Send invitation to a person',
	security: [{ bearerAuth: [] }],
	body: bodySchema,
	response: {
		201: responseSchema,
	},
};
