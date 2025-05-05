import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { IInvitationRepository } from '../repositories/invitation-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	invitationId: string;
}

type Response = Outcome<ResourceNotFoundError, { message: string }>;

@injectable()
export class RejectInvitationUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.INVITATIONS_REPOSITORY) private invitationsRepository: IInvitationRepository
	) {}

	async execute({ invitationId }: IRequest): Promise<Response> {
		const invitation = await this.invitationsRepository.findById(invitationId);

		if (!invitation) {
			return failure(new ResourceNotFoundError('Invitation not found', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		await this.invitationsRepository.delete(invitation);

		return success({ message: 'invitation reject successfully' });
	}
}
