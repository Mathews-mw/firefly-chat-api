import { z } from 'zod';
import { roomTypeSchema } from '@/domains/chat/models/entities/room';

export const roomSchema = z.object({
	id: z.string().uuid(),
	type: roomTypeSchema,
	name: z.optional(z.string()).nullable(),
	description: z.optional(z.string()).nullable(),
	owner_id: z.optional(z.string().uuid()).nullable(),
	image_url: z.optional(z.string().url()).nullable(),
	created_at: z.coerce.date(),
});

export type RoomResponseSchema = z.infer<typeof roomSchema>;
