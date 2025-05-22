import z from 'zod';

import { FastifySchema } from 'fastify/types/schema';
import { notificationSchema } from './notification-schema';

const paramSchema = z.object({
	notificationId: z.string().uuid(),
});

const responseSchema = notificationSchema;

export type GetNotificationParams = z.infer<typeof paramSchema>;
export type GetNotificationResponse = z.infer<typeof responseSchema>;

export const getNotificationResponseSchema: FastifySchema = {
	tags: ['Notifications'],
	summary: 'Get notification by id',
	security: [{ bearerAuth: [] }],
	params: paramSchema,
	response: {
		200: responseSchema,
	},
};
