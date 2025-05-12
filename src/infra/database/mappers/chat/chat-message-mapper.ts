import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ChatMessage } from '@/domains/chat/models/entities/chat-message';
import { ChatMessage as PrismaChatMessage } from 'prisma/generated/client';

export class ChatMessageMapper {
	static toDomain(data: PrismaChatMessage): ChatMessage {
		return ChatMessage.create(
			{
				roomId: new UniqueEntityId(data.roomId),
				senderId: new UniqueEntityId(data.senderId),
				content: data.content,
				isDeleted: data.isDeleted,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: ChatMessage): PrismaChatMessage {
		return {
			id: data.id.toString(),
			roomId: data.roomId.toString(),
			senderId: data.senderId.toString(),
			content: data.content,
			isDeleted: data.isDeleted,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
