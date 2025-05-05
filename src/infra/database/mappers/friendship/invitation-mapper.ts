import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Invitation } from '@/domains/chat/models/entities/invitation';
import { Invitation as PrismaInvitation } from 'prisma/generated/client';

export class InvitationMapper {
	static toDomain(data: PrismaInvitation): Invitation {
		return Invitation.create(
			{
				senderId: new UniqueEntityId(data.senderId),
				receiverId: new UniqueEntityId(data.receiverId),
				status: data.status,
				repliedAt: data.repliedAt,
				createdAt: data.createdAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: Invitation): PrismaInvitation {
		return {
			id: data.id.toString(),
			senderId: data.senderId.toString(),
			receiverId: data.receiverId.toString(),
			status: data.status,
			repliedAt: data.repliedAt ?? null,
			createdAt: data.createdAt,
		};
	}
}
