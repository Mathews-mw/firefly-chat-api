import { UserMapper } from '../user/user-mapper';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Invitation as PrismaInvitation, User as PrismaUser } from 'prisma/generated/client';
import { InvitationWithReceiver } from '@/domains/chat/models/entities/value-objects/invitation-with-receiver';

type IPrismaInvitationWithReceiver = PrismaInvitation & {
	receiver: PrismaUser;
};

export class InvitationWithReceiverMapper {
	static toDomain(data: IPrismaInvitationWithReceiver): InvitationWithReceiver {
		return InvitationWithReceiver.create({
			id: new UniqueEntityId(data.id),
			senderId: new UniqueEntityId(data.receiverId),
			receiverId: new UniqueEntityId(data.receiverId),
			status: data.status,
			repliedAt: data.repliedAt,
			createdAt: data.createdAt,
			receiver: UserMapper.toDomain(data.receiver),
		});
	}
}
