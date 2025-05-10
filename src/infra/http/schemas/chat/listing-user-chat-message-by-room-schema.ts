import z from 'zod';

import { userSchema } from '../user/user-schema';
import { FastifySchema } from 'fastify/types/schema';
import { chatMessageSchema } from './chat-message-schema';
import { readReceiptSchema } from './read-receipt-schema';
import { cursorQuerySchema, cursorResponseSchema } from '../pagination-schema';

const paramsSchema = z.object({
	roomId: z.string().uuid(),
});

const querySchema = cursorQuerySchema;

const responseSchema = z.object({
	cursor: cursorResponseSchema,
	chat_messages: z.array(
		chatMessageSchema.extend({
			author: userSchema,
			read_receipts: z.array(readReceiptSchema),
		})
	),
});

export type ListingUserChatMessageByRoomParams = z.infer<typeof paramsSchema>;
export type ListingUserChatMessageByRoomQuery = z.infer<typeof querySchema>;
export type ListingUserChatMessageByRoomResponse = z.infer<typeof responseSchema>;

export const listingUserChatMessageByRoomSchema: FastifySchema = {
	tags: ['Chat'],
	summary: 'List user chat messages by room',
	description:
		'List the message history of a user that belongs to a specific room. This route filter by `user_id` and `room_id`. The `user_id` is automatically defined by your session.',
	security: [{ bearerAuth: [] }],
	params: paramsSchema,
	querystring: querySchema,
	response: {
		200: responseSchema,
	},
};
