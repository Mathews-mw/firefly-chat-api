import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Participant } from '@/domains/chat/models/entities/participant';
import { Participant as PrismaParticipant } from 'prisma/generated/client';

export class ParticipantMapper {
	static toDomain(data: PrismaParticipant): Participant {
		return Participant.create(
			{
				roomId: new UniqueEntityId(data.roomId),
				userId: new UniqueEntityId(data.userId),
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: Participant): PrismaParticipant {
		return {
			id: data.id.toString(),
			roomId: data.roomId.toString(),
			userId: data.userId.toString(),
		};
	}
}
