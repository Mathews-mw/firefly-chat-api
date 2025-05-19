import { inject, injectable } from 'tsyringe';

import { EventBus } from '@/core/events/event-bus';
import { failure, Outcome, success } from '@/core/outcome';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { Invitation } from '@/domains/chat/models/entities/invitation';
import { IUserRepository } from '../../users/repositories/user-repository';
import { IInvitationRepository } from '../repositories/invitation-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	senderId: string;
	username: string;
}

type Response = Outcome<BadRequestError | ResourceNotFoundError, { invitation: Invitation }>;

@injectable()
export class SendInvitationUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.EVENT_BUS) private eventBus: EventBus,
		@inject(DEPENDENCY_IDENTIFIERS.USERS_REPOSITORY) private usersRepository: IUserRepository,
		@inject(DEPENDENCY_IDENTIFIERS.INVITATIONS_REPOSITORY) private invitationsRepository: IInvitationRepository
	) {}

	async execute({ senderId, username }: IRequest): Promise<Response> {
		const receiver = await this.usersRepository.findUnique({
			username,
		});

		if (!receiver) {
			return failure(
				new ResourceNotFoundError(
					'The user you entered was not found so we were unable to send the invitation.',
					'RESOURCE_NOT_FOUND_ERROR'
				)
			);
		}

		if (senderId === receiver.id.toString()) {
			return failure(new BadRequestError("Ops! You can't invite yourself!", 'BAD_REQUEST_ERROR'));
		}

		const invitationAlreadySent = await this.invitationsRepository.findUnique({
			senderId,
			receiverId: receiver.id.toString(),
		});

		if (invitationAlreadySent) {
			return failure(new BadRequestError('Invitation already sent to this person', 'BAD_REQUEST_ERROR'));
		}

		const newInvitation = Invitation.create({
			senderId: new UniqueEntityId(senderId),
			receiverId: new UniqueEntityId(receiver.id.toString()),
		});

		await this.invitationsRepository.create(newInvitation);

		await this.eventBus.publish(...newInvitation.pullDomainEvents());

		return success({ invitation: newInvitation });
	}
}
