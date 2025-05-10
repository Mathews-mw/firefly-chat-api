import z from 'zod';

import { roomSchema } from './room-schema';
import { userSchema } from '../user/user-schema';
import { FastifySchema } from 'fastify/types/schema';
import { participantSchema } from './participant-schema';
import { chatMessageSchema } from './chat-message-schema';
import { cursorQuerySchema, cursorResponseSchema } from '../pagination-schema';

const querySchema = cursorQuerySchema;

const responseSchema = z.object({
	cursor: cursorResponseSchema,
	rooms: z.array(
		roomSchema.extend({
			participants: z.array(
				participantSchema.extend({
					user: userSchema,
				})
			),
			chat_messages: z.array(
				chatMessageSchema.extend({
					author: userSchema,
				})
			),
		})
	),
});

export type ListingUserPrivateRoomsQuery = z.infer<typeof querySchema>;
export type ListingUserPrivateRoomsResponse = z.infer<typeof responseSchema>;

export const listingUserPrivateRoomsSchema: FastifySchema = {
	tags: ['Chat'],
	summary: 'List user private rooms.',
	description:
		'Shows all rooms the user is part of. Return only the last message in the message list (`chat_messages`).',
	security: [{ bearerAuth: [] }],
	querystring: querySchema,
	response: {
		200: responseSchema,
	},
};
