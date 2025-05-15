import z from 'zod';

import { roomSchema } from './room-schema';
import { userSchema } from '../user/user-schema';
import { FastifySchema } from 'fastify/types/schema';
import { participantSchema } from './participant-schema';
import { attachmentSchema } from '../attachment/attachment-schema';
import { attachmentTypeSchema } from '@/domains/chat/models/entities/attachment';

const paramsSchema = z.object({
	roomId: z.string().uuid(),
});

const querySchema = z.object({
	is_private: z.optional(z.coerce.boolean()),
});

// Record<"IMAGE" | "VIDEO" | "DOCUMENT" | "FILE" | "AUDIO", AttachmentPresenter[]>
const responseSchema = roomSchema.extend({
	participants: z.array(
		participantSchema.extend({
			user: userSchema,
		})
	),
	attachments: z.record(attachmentTypeSchema, z.array(attachmentSchema)),
});

export type GetRoomDetailsParams = z.infer<typeof paramsSchema>;
export type GetRoomDetailsQuery = z.infer<typeof querySchema>;
export type GetRoomDetailsResponse = z.infer<typeof responseSchema>;

export const getRoomDetailsSchema: FastifySchema = {
	tags: ['Chat'],
	summary: 'Get room details',
	security: [{ bearerAuth: [] }],
	params: paramsSchema,
	querystring: querySchema,
	response: {
		200: responseSchema,
	},
};
