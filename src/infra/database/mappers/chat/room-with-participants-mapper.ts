import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ParticipantWithUserMapper } from './participant-with-user';
import { RoomWithParticipants } from '@/domains/chat/models/entities/value-objects/room-with-participants';
import { ChatMessageWithAuthorMapper, IPrismaChatMessageWithAuthor } from './chat-message-with-author-mapper';
import { Participant as PrismaParticipant, Room as PrismaRoom, User as PrismaUser } from 'prisma/generated/client';

export type IPrismaParticipantWithUser = PrismaParticipant & {
	user: PrismaUser;
};

export type IPrismaRoomWithParticipants = PrismaRoom & {
	participants: Array<IPrismaParticipantWithUser>;
	chatMessages: Array<IPrismaChatMessageWithAuthor>;
};

export class RoomWithParticipantsMapper {
	static toDomain(data: IPrismaRoomWithParticipants): RoomWithParticipants {
		return RoomWithParticipants.create({
			id: new UniqueEntityId(data.id),
			type: data.type,
			createdAt: data.createdAt,
			participants: data.participants.map(ParticipantWithUserMapper.toDomain),
			chatMessages: data.chatMessages.map(ChatMessageWithAuthorMapper.toDomain),
		});
	}
}
