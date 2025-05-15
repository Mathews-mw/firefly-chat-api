import { UserMapper } from '../user/user-mapper';
import { ReadReceiptMapper } from './read-receipt-mapper';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AttachmentMapper } from '../attachment/attachment-mapper';
import { ChatMessageWithAuthor } from '@/domains/chat/models/entities/value-objects/chat-message-with-author';
import {
	Attachment as PrismaAttachment,
	ChatMessage as PrismaChatMessage,
	User as PrismaUser,
	ReadReceipt as PrismaReadReceipt,
} from 'prisma/generated/client';

export type IPrismaChatMessageWithAuthor = PrismaChatMessage & {
	author: PrismaUser;
	readReceipts: Array<PrismaReadReceipt>;
	attachments: Array<PrismaAttachment>;
};

export class ChatMessageWithAuthorMapper {
	static toDomain(data: IPrismaChatMessageWithAuthor): ChatMessageWithAuthor {
		return ChatMessageWithAuthor.create({
			id: new UniqueEntityId(data.id),
			roomId: new UniqueEntityId(data.roomId),
			senderId: new UniqueEntityId(data.senderId),
			content: data.content,
			isDeleted: data.isDeleted,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			author: UserMapper.toDomain(data.author),
			readReceipts: data.readReceipts.map(ReadReceiptMapper.toDomain),
			attachments: data.attachments.map(AttachmentMapper.toDomain),
		});
	}
}
