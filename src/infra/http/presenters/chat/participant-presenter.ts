import { Participant } from '@/domains/chat/models/entities/participant';
import { ParticipantResponseSchema } from '../../schemas/chat/participant-schema';

export class ParticipantPresenter {
	static toHTTP(data: Participant): ParticipantResponseSchema {
		return {
			id: data.id.toString(),
			room_id: data.roomId.toString(),
			user_id: data.userId.toString(),
		};
	}
}
