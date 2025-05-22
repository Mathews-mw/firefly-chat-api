import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

const paramSchema = z.object({
	roomId: z.string(),
});

const bodySchema = z.object({
	participant_ids: z.array(z.string()),
});

const responseSchema = z.object({
	message: z.string(),
});

export type AddParticipantsToRoomParams = z.infer<typeof paramSchema>;
export type AddParticipantsToRoomRequest = z.infer<typeof bodySchema>;
export type AddParticipantsToRoomResponse = z.infer<typeof responseSchema>;

export const addParticipantsToRoomSchema: FastifySchema = {
	tags: ['Chat'],
	summary: 'Add participants to room',
	description: 'Add participants to an existing room. You need to be the owner room to do so.',
	security: [{ bearerAuth: [] }],
	body: bodySchema,
	response: {
		200: responseSchema,
	},
};
