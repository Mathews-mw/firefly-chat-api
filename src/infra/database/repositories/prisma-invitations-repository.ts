import { prisma } from '../prisma';
import { Invitation } from '@/domains/chat/models/entities/invitation';
import { InvitationMapper } from '../mappers/friendship/invitation-mapper';
import {
	IFindManyByReceiverQuery,
	IFindManyBySenderQuery,
	IFindUniqueQuery,
	IInvitationRepository,
} from '@/domains/chat/application/features/friendships/repositories/invitation-repository';

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
		});

		return invitations.map(InvitationMapper.toDomain);
	}

	async findManyByReceiverId({ receiverId, status }: IFindManyByReceiverQuery): Promise<Invitation[]> {
		const invitations = await prisma.invitation.findMany({
			where: {
				receiverId,
				status: status,
			},
		});

		return invitations.map(InvitationMapper.toDomain);
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
