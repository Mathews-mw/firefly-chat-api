import { inject, injectable } from 'tsyringe';

import { Outcome, success } from '@/core/outcome';
import { IInvitationRepository } from '../repositories/invitation-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { InvitationWithReceiver } from '@/domains/chat/models/entities/value-objects/invitation-with-receiver';

interface IRequest {
	meId: string;
}

type Response = Outcome<null, { invitations: Array<InvitationWithReceiver> }>;

@injectable()
export class ListingUserSentInvitationsUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.INVITATIONS_REPOSITORY) private invitationsRepository: IInvitationRepository
	) {}

	async execute({ meId }: IRequest): Promise<Response> {
		const invitations = await this.invitationsRepository.findManyBySenderId({
			senderId: meId,
		});

		return success({ invitations });
	}
}
