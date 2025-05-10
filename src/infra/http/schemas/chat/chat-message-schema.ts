import { z } from 'zod';

export const chatMessageSchema = z.object({
	id: z.string().uuid(),
	room_id: z.string().uuid(),
	sender_id: z.string().uuid(),
	content: z.string(),
	created_at: z.coerce.date(),
	updated_at: z.optional(z.coerce.date()).nullable(),
});

export type ChatMessageResponseSchema = z.infer<typeof chatMessageSchema>;
