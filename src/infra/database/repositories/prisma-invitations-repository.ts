import { prisma } from '../prisma';
import { Invitation } from '@/domains/chat/models/entities/invitation';
import { InvitationMapper } from '../mappers/friendship/invitation-mapper';
import { InvitationWithSenderMapper } from '../mappers/friendship/invitation-with-sender-mapper';
import {
	IFindManyByReceiverQuery,
	IFindManyBySenderQuery,
	IFindUniqueQuery,
	IInvitationRepository,
	IInvitationsAmountQuery,
} from '@/domains/chat/application/features/friendships/repositories/invitation-repository';
import { InvitationWithReceiverMapper } from '../mappers/friendship/invitation-with-receiver-mapper';

export class PrismaInvitationsRepository implements IInvitationRepository {
	async create(invitation: Invitation) {
		const data = InvitationMapper.toPrisma(invitation);

		await prisma.invitation.create({
			data,
		});

		return invitation;
	}

	async update(invitation: Invitation) {
		const data = InvitationMapper.toPrisma(invitation);

		await prisma.invitation.update({
			data,
			where: {
				id: data.id,
			},
		});

		return invitation;
	}

	async delete(invitation: Invitation) {
		await prisma.invitation.delete({
			where: {
				id: invitation.id.toString(),
			},
		});
	}

	async findManyBySenderId({ senderId, status }: IFindManyBySenderQuery) {
		const invitations = await prisma.invitation.findMany({
			where: {
				senderId,
				status: status,
			},
			include: {
				receiver: true,
			},
		});

		return invitations.map(InvitationWithReceiverMapper.toDomain);
	}

	async findManyByReceiverId({ receiverId, status }: IFindManyByReceiverQuery) {
		const invitations = await prisma.invitation.findMany({
			where: {
				receiverId,
				status: status,
			},
			include: {
				sender: true,
			},
		});

		return invitations.map(InvitationWithSenderMapper.toDomain);
	}

	async invitationsAmount({ receiverId, senderId, status }: IInvitationsAmountQuery): Promise<number> {
		const amount = await prisma.invitation.count({
			where: {
				senderId,
				receiverId,
				status: status,
			},
		});

		return amount;
	}

	async findById(id: string) {
		const invitation = await prisma.invitation.findUnique({
			where: {
				id,
			},
		});

		if (!invitation) {
			return null;
		}

		return InvitationMapper.toDomain(invitation);
	}

	async findUnique({ senderId, receiverId }: IFindUniqueQuery): Promise<Invitation | null> {
		const invitation = await prisma.invitation.findUnique({
			where: {
				senderId_receiverId: {
					senderId,
					receiverId,
				},
			},
		});

		if (!invitation) {
			return null;
		}

		return InvitationMapper.toDomain(invitation);
	}
}
