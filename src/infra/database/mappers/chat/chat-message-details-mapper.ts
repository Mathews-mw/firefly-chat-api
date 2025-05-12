import { ChatMessageDetails } from '@/domains/chat/models/entities/value-objects/chat-message-details';
import { UserMapper } from '../user/user-mapper';
import { ReadReceiptMapper } from './read-receipt-mapper';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	ChatMessage as PrismaChatMessage,
	User as PrismaUser,
	Room as PrismaRoom,
	ReadReceipt as PrismaReadReceipt,
} from 'prisma/generated/client';
import { RoomMapper } from './room-mapper';

export type IPrismaChatMessageDetails = PrismaChatMessage & {
	author: PrismaUser;
	readReceipts: Array<PrismaReadReceipt>;
	room: PrismaRoom;
};

export class ChatMessageDetailsMapper {
	static toDomain(data: IPrismaChatMessageDetails): ChatMessageDetails {
		return ChatMessageDetails.create({
			id: new UniqueEntityId(data.id),
			roomId: new UniqueEntityId(data.roomId),
			senderId: new UniqueEntityId(data.senderId),
			content: data.content,
			isDeleted: data.isDeleted,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			author: UserMapper.toDomain(data.author),
			readReceipts: data.readReceipts.map(ReadReceiptMapper.toDomain),
			room: RoomMapper.toDomain(data.room),
		});
	}
}
