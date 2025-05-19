import { inject, injectable } from 'tsyringe';

import { EventBus } from '@/core/events/event-bus';
import { failure, Outcome, success } from '@/core/outcome';
import { Friendship } from '@/domains/chat/models/entities/friendship';
import { IInvitationRepository } from '../repositories/invitation-repository';
import { IFriendshipRepository } from '../repositories/friendship-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { AcceptInvitationEvent } from '@/domains/chat/events/accept-invitation-event';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	invitationId: string;
}

type Response = Outcome<ResourceNotFoundError, { message: string }>;

@injectable()
export class AcceptInvitationUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.EVENT_BUS) private eventBus: EventBus,
		@inject(DEPENDENCY_IDENTIFIERS.INVITATIONS_REPOSITORY) private invitationsRepository: IInvitationRepository,
		@inject(DEPENDENCY_IDENTIFIERS.FRIENDSHIPS_REPOSITORY) private friendshipsRepository: IFriendshipRepository
	) {}

	async execute({ invitationId }: IRequest): Promise<Response> {
		const invitation = await this.invitationsRepository.findById(invitationId);

		if (!invitation) {
			return failure(new ResourceNotFoundError('Invitation not found', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		const senderFriendShip = Friendship.create({
			userId: invitation.senderId,
			friendId: invitation.receiverId,
		});

		senderFriendShip.addDomainEvent(new AcceptInvitationEvent(senderFriendShip));

		const receiverFriendShip = Friendship.create({
			userId: invitation.receiverId,
			friendId: invitation.senderId,
		});

		await this.friendshipsRepository.createMany([senderFriendShip, receiverFriendShip]);
		await this.invitationsRepository.delete(invitation);

		await this.eventBus.publish(...senderFriendShip.pullDomainEvents());

		return success({ message: 'invitation accepted successfully' });
	}
}
