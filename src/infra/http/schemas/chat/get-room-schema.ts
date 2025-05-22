import z from 'zod';

import { roomSchema } from './room-schema';
import { userSchema } from '../user/user-schema';
import { FastifySchema } from 'fastify/types/schema';
import { participantSchema } from './participant-schema';
import { roomTypeSchema } from '@/domains/chat/models/entities/room';

const paramsSchema = z.object({
	roomId: z.string().uuid(),
});

const querySchema = z.object({
	type: z.optional(roomTypeSchema),
	user_id: z.optional(z.string().uuid()),
});

const responseSchema = roomSchema.extend({
	participants: z.array(
		participantSchema.extend({
			user: userSchema,
		})
	),
});

export type GetRoomParams = z.infer<typeof paramsSchema>;
export type GetRoomQuery = z.infer<typeof querySchema>;
export type GetRoomResponse = z.infer<typeof responseSchema>;

export const getRoomSchema: FastifySchema = {
	tags: ['Chat'],
	summary: 'Get a unique room',
	description:
		'Use the `type` query param to improve the query. You can also use the `user_id` query param to remove the informed user from participants list.',
	security: [{ bearerAuth: [] }],
	params: paramsSchema,
	querystring: querySchema,
	response: {
		200: responseSchema,
	},
};
