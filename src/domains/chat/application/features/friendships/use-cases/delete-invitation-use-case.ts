import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { ForbiddenError } from '@/core/errors/forbidden-error';
import { IInvitationRepository } from '../repositories/invitation-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	invitationId: string;
	inviteOwnerId: string;
}

type Response = Outcome<ResourceNotFoundError | ForbiddenError, { message: string }>;

@injectable()
export class DeleteInvitationUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.INVITATIONS_REPOSITORY) private invitationsRepository: IInvitationRepository
	) {}

	async execute({ invitationId, inviteOwnerId }: IRequest): Promise<Response> {
		const invitation = await this.invitationsRepository.findById(invitationId);

		if (!invitation) {
			return failure(new ResourceNotFoundError('Invitation not found', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		if (invitation.senderId.toString() !== inviteOwnerId) {
			return failure(
				new ForbiddenError(
					"You cannot delete an invitation that doesn't belongs to you!",
					'INSUFFICIENT_PERMISSION_ERROR'
				)
			);
		}

		await this.invitationsRepository.delete(invitation);

		return success({ message: 'invitation deleted successfully' });
	}
}
