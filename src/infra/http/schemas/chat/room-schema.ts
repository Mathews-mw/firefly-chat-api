import { z } from 'zod';
import { roomTypeSchema } from '@/domains/chat/models/entities/room';

export const roomSchema = z.object({
	id: z.string().uuid(),
	type: roomTypeSchema,
	created_at: z.coerce.date(),
});

export type RoomResponseSchema = z.infer<typeof roomSchema>;
