import { z } from 'zod';
import { notificationTypeKeySchema } from '@/domains/notification/models/notification-type';

export const notificationSchema = z.object({
	id: z.string().uuid(),
	recipient_id: z.string().uuid(),
	type: notificationTypeKeySchema,
	data: z.object({
		title: z.string(),
		content: z.string(),
		metadata: z.optional(z.record(z.unknown())).nullable(),
	}),
	is_read: z.coerce.boolean(),
	created_at: z.coerce.date(),
});

export type NotificationResponseSchema = z.infer<typeof notificationSchema>;
