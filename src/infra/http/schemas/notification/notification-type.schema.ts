import { notificationTypeKeySchema } from '@/domains/notification/models/notification-type';
import { z } from 'zod';

export const notificationTypeSchema = z.object({
	key: z.string(),
	label: z.string(),
});

export type NotificationTypeResponseSchema = z.infer<typeof notificationTypeSchema>;
