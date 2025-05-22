import z from 'zod';

import { FastifySchema } from 'fastify/types/schema';
import { notificationSchema } from './notification-schema';
import { notificationTypeSchema } from './notification-type.schema';
import { cursorQuerySchema, cursorResponseSchema } from '../pagination-schema';
import { notificationTypeKeySchema } from '@/domains/notification/models/notification-type';

const querySchema = cursorQuerySchema.extend({
	type: z.optional(notificationTypeKeySchema),
	is_read: z.optional(
		z.union([z.literal('true'), z.literal('false')]).transform((value) => (value === 'true' ? true : false))
	),
});

const responseSchema = z.object({
	cursor: cursorResponseSchema,
	notifications: z.array(
		notificationSchema.extend({
			notification_type: notificationTypeSchema,
		})
	),
});

export type ListingUserNotificationsCursorQuery = z.infer<typeof querySchema>;
export type ListingUserNotificationsCursorResponse = z.infer<typeof responseSchema>;

export const listingUserNotificationsCursorResponseSchema: FastifySchema = {
	tags: ['Notifications'],
	summary: 'Listing user notifications cursor mode',
	security: [{ bearerAuth: [] }],
	querystring: querySchema,
	response: {
		200: responseSchema,
	},
};
