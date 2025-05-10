import { ChatMessage } from '@/domains/chat/models/entities/chat-message';
import { ICursorParams, ICursorResponse } from '@/core/interfaces/paginating-interfaces';
import { ChatMessageWithAuthor } from '@/domains/chat/models/entities/value-objects/chat-message-with-author';

export interface IChatMessageQuerySearchWithCursor extends ICursorParams {
	roomId: string;
}

export interface IChatMessageWithCursorResponse extends ICursorResponse {
	chatMessages: Array<ChatMessageWithAuthor>;
}

export interface IChatMessageRepository {
	create(data: ChatMessage): Promise<ChatMessage>;
	update(data: ChatMessage): Promise<ChatMessage>;
	delete(chatMessage: ChatMessage): Promise<void>;
	findMany(): Promise<ChatMessage[]>;
	findManyWithCursor(query: IChatMessageQuerySearchWithCursor): Promise<IChatMessageWithCursorResponse>;
	findById(id: string): Promise<ChatMessage | null>;
}
