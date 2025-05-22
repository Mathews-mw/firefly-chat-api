import z from 'zod';

import { roomSchema } from './room-schema';
import { userSchema } from '../user/user-schema';
import { FastifySchema } from 'fastify/types/schema';
import { participantSchema } from './participant-schema';
import { chatMessageSchema } from './chat-message-schema';
import { attachmentSchema } from '../attachment/attachment-schema';
import { roomTypeSchema } from '@/domains/chat/models/entities/room';
import { cursorQuerySchema, cursorResponseSchema } from '../pagination-schema';

const querySchema = cursorQuerySchema.extend({
	type: z.optional(roomTypeSchema),
});

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
					attachments: z.array(attachmentSchema),
				})
			),
		})
	),
});

export type ListingUserRoomsQuery = z.infer<typeof querySchema>;
export type ListingUserRoomsResponse = z.infer<typeof responseSchema>;

export const listingUserRoomsSchema: FastifySchema = {
	tags: ['Chat'],
	summary: 'List user rooms.',
	description:
		'Shows all rooms the user is part of. Return only the last message in the message list (`chat_messages`).',
	security: [{ bearerAuth: [] }],
	querystring: querySchema,
	response: {
		200: responseSchema,
	},
};
