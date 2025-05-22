import z from 'zod';

import { FastifySchema } from 'fastify/types/schema';
import { notificationSchema } from './notification-schema';
import { paginationResponseSchema } from '../pagination-schema';
import { notificationTypeSchema } from './notification-type.schema';

const querySchema = z.object({
	page: z.optional(z.coerce.number()).default(1),
	per_page: z.optional(z.union([z.literal('all'), z.coerce.number()])).default(10),
});

const responseSchema = z.object({
	pagination: paginationResponseSchema,
	notifications: z.array(
		notificationSchema.extend({
			notification_type: notificationTypeSchema,
		})
	),
});

export type ListingUserNotificationsQuery = z.infer<typeof querySchema>;
export type ListingUserNotificationsResponse = z.infer<typeof responseSchema>;

export const listingUserNotificationsResponseSchema: FastifySchema = {
	tags: ['Notifications'],
	summary: 'Listing user notifications',
	security: [{ bearerAuth: [] }],
	querystring: querySchema,
	response: {
		200: responseSchema,
	},
};
