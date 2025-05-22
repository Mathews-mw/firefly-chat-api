import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

const paramSchema = z.object({
	roomId: z.string(),
});

const bodySchema = z.object({
	participant_id: z.string().uuid(),
});

const responseSchema = z.object({
	message: z.string(),
});

export type RemoveParticipantFromRoomParams = z.infer<typeof paramSchema>;
export type RemoveParticipantFromRoomRequest = z.infer<typeof bodySchema>;
export type RemoveParticipantFromRoomResponse = z.infer<typeof responseSchema>;

export const removeParticipantFromRoomSchema: FastifySchema = {
	tags: ['Chat'],
	summary: 'Remove participant from room',
	description: 'Remove participant from an existing room. You need to be the owner room to do so.',
	security: [{ bearerAuth: [] }],
	body: bodySchema,
	response: {
		200: responseSchema,
	},
};
