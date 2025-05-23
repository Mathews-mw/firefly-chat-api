import { ParticipantWithUserPresenter } from './participant-with-user-presenter';
import { ChatMessageWithAuthorPresenter } from './chat-message-with-author-presenter';
import { RoomWithParticipants } from '@/domains/chat/models/entities/value-objects/room-with-participants';

export class RoomWithParticipantsPresenter {
	static toHTTP(data: RoomWithParticipants) {
		return {
			id: data.id.toString(),
			type: data.type,
			name: data.name,
			description: data.description,
			image_url: data.imageUrl,
			owner_id: data.ownerId ? data.ownerId.toString() : null,
			created_at: data.createdAt,
			participants: data.participants.map(ParticipantWithUserPresenter.toHTTP),
			chat_messages: data.chatMessages.map(ChatMessageWithAuthorPresenter.toHTTP),
		};
	}
}
