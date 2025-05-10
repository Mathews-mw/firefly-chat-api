import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { ForbiddenError } from '@/core/errors/forbidden-error';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ReadReceipt } from '@/domains/chat/models/entities/read-receipt';
import { IParticipantRepository } from '../repositories/participant-repository';
import { IReadReceiptRepository } from '../repositories/read-receipt-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	userId: string;
	roomId: string;
	messageIds: Array<string>;
}

type Response = Outcome<ForbiddenError, { amount: number }>;

@injectable()
export class MarkMessagesAsReadUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.PARTICIPANTS_REPOSITORY) private participantsRepository: IParticipantRepository,
		@inject(DEPENDENCY_IDENTIFIERS.READ_RECEIPTS_REPOSITORY) private readReceiptsRepository: IReadReceiptRepository
	) {}

	async execute({ userId, roomId, messageIds }: IRequest): Promise<Response> {
		const userBelongsToRoom = await this.participantsRepository.findUnique({ userId, roomId });

		if (!userBelongsToRoom) {
			return failure(new ForbiddenError('User does not participate in the room', 'FORBIDDEN_ERROR'));
		}

		const receipts = messageIds.map((messageId) =>
			ReadReceipt.create({ userId: new UniqueEntityId(userId), messageId: new UniqueEntityId(messageId) })
		);

		const amount = await this.readReceiptsRepository.createMany(receipts);

		return success({ amount });
	}
}
