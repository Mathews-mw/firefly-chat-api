import { UserMapper } from '../user/user-mapper';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Participant as PrismaParticipant, User as PrismaUser } from 'prisma/generated/client';
import { ParticipantWithUser } from '@/domains/chat/models/entities/value-objects/participant-with-user';

export type IPrismaParticipantWithUser = PrismaParticipant & {
	user: PrismaUser;
};

export class ParticipantWithUserMapper {
	static toDomain(data: IPrismaParticipantWithUser): ParticipantWithUser {
		return ParticipantWithUser.create({
			id: new UniqueEntityId(data.id),
			roomId: new UniqueEntityId(data.roomId),
			userId: new UniqueEntityId(data.userId),
			user: UserMapper.toDomain(data.user),
		});
	}
}
