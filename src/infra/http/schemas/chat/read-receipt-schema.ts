import { z } from 'zod';

export const readReceiptSchema = z.object({
	message_id: z.string().uuid(),
	user_id: z.string().uuid(),
	read_at: z.coerce.date(),
});

export type ReadReceiptResponseSchema = z.infer<typeof readReceiptSchema>;
