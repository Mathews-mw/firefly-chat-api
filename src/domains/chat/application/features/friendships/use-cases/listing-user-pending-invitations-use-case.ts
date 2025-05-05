import { inject, injectable } from 'tsyringe';

import { Outcome, success } from '@/core/outcome';
import { Invitation } from '@/domains/chat/models/entities/invitation';
import { IInvitationRepository } from '../repositories/invitation-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	meId: string;
}

type Response = Outcome<null, { invitations: Array<Invitation> }>;

@injectable()
export class ListingUserPendingInvitationsUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.INVITATIONS_REPOSITORY) private invitationsRepository: IInvitationRepository
	) {}

	async execute({ meId }: IRequest): Promise<Response> {
		const invitations = await this.invitationsRepository.findManyByReceiverId({
			receiverId: meId,
			status: 'PENDING',
		});

		return success({ invitations });
	}
}
