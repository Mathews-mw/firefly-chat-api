import { z } from 'zod';

export const participantSchema = z.object({
	id: z.string().uuid(),
	room_id: z.string().uuid(),
	user_id: z.string().uuid(),
});

export type ParticipantResponseSchema = z.infer<typeof participantSchema>;
