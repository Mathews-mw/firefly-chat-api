import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

const bodySchema = z.object({
	name: z.string(),
	description: z.optional(z.string()),
	image_url: z.optional(z.string().url()),
});

const responseSchema = z.object({
	message: z.string(),
	room_id: z.string().uuid(),
});

export type CreateGroupRoomRequest = z.infer<typeof bodySchema>;
export type CreateGroupRoomResponse = z.infer<typeof responseSchema>;

export const createGroupRoomSchema: FastifySchema = {
	tags: ['Chat'],
	summary: 'Create a new group room',
	description: 'Creates a new group room do chat with members.',
	security: [{ bearerAuth: [] }],
	body: bodySchema,
	response: {
		201: responseSchema,
	},
};
