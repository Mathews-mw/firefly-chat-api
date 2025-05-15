import { z } from 'zod';
import { attachmentTypeSchema } from '@/domains/chat/models/entities/attachment';

export const attachmentSchema = z.object({
	id: z.string().uuid(),
	title: z.string(),
	url: z.string().url(),
	room_id: z.optional(z.string().uuid()).nullable(),
	message_id: z.optional(z.string().uuid()).nullable(),
	type: attachmentTypeSchema,
});

export type AttachmentResponseSchema = z.infer<typeof attachmentSchema>;
