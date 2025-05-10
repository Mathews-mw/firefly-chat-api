import { ChatMessage } from '@/domains/chat/models/entities/chat-message';
import { ChatMessageResponseSchema } from '../../schemas/chat/chat-message-schema';

export class ChatMessagePresenter {
	static toHTTP(data: ChatMessage): ChatMessageResponseSchema {
		return {
			id: data.id.toString(),
			room_id: data.roomId.toString(),
			sender_id: data.senderId.toString(),
			content: data.content,
			created_at: data.createdAt,
			updated_at: data.updatedAt ?? null,
		};
	}
}
