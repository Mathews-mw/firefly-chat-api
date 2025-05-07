import { inject, injectable } from 'tsyringe';

import { Outcome, success } from '@/core/outcome';
import { IInvitationRepository } from '../repositories/invitation-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { InvitationWithSender } from '@/domains/chat/models/entities/value-objects/invitation-with-sender';

interface IRequest {
	meId: string;
}

type Response = Outcome<null, { invitations: Array<InvitationWithSender> }>;

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
