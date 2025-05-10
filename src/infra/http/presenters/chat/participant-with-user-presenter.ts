import { UserPresenter } from '../users/user-presenter';
import { ParticipantWithUser } from '@/domains/chat/models/entities/value-objects/participant-with-user';

export class ParticipantWithUserPresenter {
	static toHTTP(data: ParticipantWithUser) {
		return {
			id: data.id.toString(),
			room_id: data.roomId.toString(),
			user_id: data.userId.toString(),
			user: UserPresenter.toHTTP(data.user),
		};
	}
}
