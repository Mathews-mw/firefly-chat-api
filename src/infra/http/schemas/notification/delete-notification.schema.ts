import z from 'zod';

import { FastifySchema } from 'fastify/types/schema';

const paramSchema = z.object({
	notificationId: z.string().uuid(),
});

const responseSchema = z.object({
	message: z.string(),
});

export type DeleteNotificationParams = z.infer<typeof paramSchema>;
export type DeleteNotificationResponse = z.infer<typeof responseSchema>;

export const deleteNotificationResponseSchema: FastifySchema = {
	tags: ['Notifications'],
	summary: 'Delete notification.',
	security: [{ bearerAuth: [] }],
	params: paramSchema,
	response: {
		200: responseSchema,
	},
};
