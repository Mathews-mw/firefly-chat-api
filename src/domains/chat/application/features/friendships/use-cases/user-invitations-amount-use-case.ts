import { inject, injectable } from 'tsyringe';

import { Outcome, success } from '@/core/outcome';
import { IInvitationStatus } from '@/domains/chat/models/entities/invitation';
import { IInvitationRepository } from '../repositories/invitation-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	receiverId?: string;
	senderId?: string;
	status?: IInvitationStatus;
}

type Response = Outcome<null, { amount: number }>;

@injectable()
export class UserInvitationsAmountUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.INVITATIONS_REPOSITORY) private invitationsRepository: IInvitationRepository
	) {}

	async execute({ senderId, receiverId, status }: IRequest): Promise<Response> {
		const result = await this.invitationsRepository.invitationsAmount({
			receiverId,
			senderId,
			status,
		});

		return success({ amount: result });
	}
}
