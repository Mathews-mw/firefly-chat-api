import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { Invitation } from '@/domains/chat/models/entities/invitation';
import { IInvitationRepository } from '../repositories/invitation-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	senderId: string;
	receiverId: string;
}

type Response = Outcome<BadRequestError, { invitation: Invitation }>;

@injectable()
export class SendInvitationUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.INVITATIONS_REPOSITORY) private invitationsRepository: IInvitationRepository
	) {}

	async execute({ senderId, receiverId }: IRequest): Promise<Response> {
		const invitationAlreadySent = await this.invitationsRepository.findUnique({
			senderId,
			receiverId,
		});

		if (invitationAlreadySent) {
			return failure(new BadRequestError('Invitation already sent to this person', 'BAD_REQUEST_ERROR'));
		}

		const newInvitation = Invitation.create({
			senderId: new UniqueEntityId(senderId),
			receiverId: new UniqueEntityId(receiverId),
		});

		await this.invitationsRepository.create(newInvitation);

		return success({ invitation: newInvitation });
	}
}
