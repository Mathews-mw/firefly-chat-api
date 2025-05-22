import z from 'zod';

import { FastifySchema } from 'fastify/types/schema';

const responseSchema = z.object({
	total: z.coerce.number(),
	read: z.coerce.number(),
	unread: z.coerce.number(),
});

export type GetAmountNotificationsResponse = z.infer<typeof responseSchema>;

export const getAmountNotificationsResponseSchema: FastifySchema = {
	tags: ['Notifications'],
	summary: 'Get total amount notifications.',
	security: [{ bearerAuth: [] }],
	response: {
		200: responseSchema,
	},
};
