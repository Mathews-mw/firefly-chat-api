import z from 'zod';

import { FastifySchema } from 'fastify/types/schema';

const bodySchema = z.object({
	notification_ids: z.array(z.string().uuid()),
});

const responseSchema = z.object({
	message: z.string(),
});

export type ReadingNotificationsRequest = z.infer<typeof bodySchema>;
export type ReadingNotificationsResponse = z.infer<typeof responseSchema>;

export const readingNotificationsResponseSchema: FastifySchema = {
	tags: ['Notifications'],
	summary: 'Reading notifications.',
	security: [{ bearerAuth: [] }],
	body: bodySchema,
	response: {
		200: responseSchema,
	},
};
