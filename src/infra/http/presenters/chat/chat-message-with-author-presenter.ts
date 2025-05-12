import { UserPresenter } from '../users/user-presenter';
import { ReadReceiptPresenter } from './read-receipt-presenter';
import { ChatMessageWithAuthor } from '@/domains/chat/models/entities/value-objects/chat-message-with-author';

export class ChatMessageWithAuthorPresenter {
	static toHTTP(data: ChatMessageWithAuthor) {
		return {
			id: data.id.toString(),
			room_id: data.roomId.toString(),
			sender_id: data.senderId.toString(),
			content: data.content,
			is_deleted: data.isDeleted,
			created_at: data.createdAt,
			updated_at: data.updatedAt ?? null,
			author: UserPresenter.toHTTP(data.author),
			read_receipts: data.readReceipts.map(ReadReceiptPresenter.toHTTP),
		};
	}
}
