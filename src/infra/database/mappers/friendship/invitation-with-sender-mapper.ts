import { UserMapper } from '../user/user-mapper';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Invitation as PrismaInvitation, User as PrismaUser } from 'prisma/generated/client';
import { InvitationWithSender } from '@/domains/chat/models/entities/value-objects/invitation-with-sender';

type IPrismaInvitationWithSender = PrismaInvitation & {
	sender: PrismaUser;
};

export class InvitationWithSenderMapper {
	static toDomain(data: IPrismaInvitationWithSender): InvitationWithSender {
		return InvitationWithSender.create({
			id: new UniqueEntityId(data.id),
			senderId: new UniqueEntityId(data.senderId),
			receiverId: new UniqueEntityId(data.receiverId),
			status: data.status,
			repliedAt: data.repliedAt,
			createdAt: data.createdAt,
			sender: UserMapper.toDomain(data.sender),
		});
	}
}
