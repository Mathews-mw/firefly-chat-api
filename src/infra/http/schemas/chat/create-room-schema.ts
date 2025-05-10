import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

const bodySchema = z.object({
	guest_id: z.string().uuid(),
});

const responseSchema = z.object({
	message: z.string(),
	room_id: z.string().uuid(),
});

export type CreateRoomRequest = z.infer<typeof bodySchema>;
export type CreateRoomResponse = z.infer<typeof responseSchema>;

export const createRoomSchema: FastifySchema = {
	tags: ['Chat'],
	summary: 'Create a new room',
	description:
		'Creates a new room with the two specified users. If the room already exists, then it is returned in the response.',
	security: [{ bearerAuth: [] }],
	body: bodySchema,
	response: {
		201: responseSchema,
		403: z.object({
			code: z.literal('FORBIDDEN_ERROR'),
			message: z.string(),
		}),
	},
};
