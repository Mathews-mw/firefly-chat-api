import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { ForbiddenError } from '@/core/errors/forbidden-error';
import { IRoomRepository } from '../repositories/room-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { IParticipantRepository } from '../repositories/participant-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	userId: string;
	roomId: string;
	participantId: string;
}

type Response = Outcome<ForbiddenError | ResourceNotFoundError, null>;

@injectable()
export class RemoveParticipantFromRoomUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.ROOMS_REPOSITORY) private roomsRepository: IRoomRepository,
		@inject(DEPENDENCY_IDENTIFIERS.PARTICIPANTS_REPOSITORY) private participantsRepository: IParticipantRepository
	) {}

	async execute({ userId, roomId, participantId }: IRequest): Promise<Response> {
		const room = await this.roomsRepository.findById(roomId);
		const participant = await this.participantsRepository.findUnique({ roomId: roomId, userId: participantId });

		if (!room) {
			return failure(new ResourceNotFoundError('Room not fount', 'RESOURCE_NOT_FOUND_ERROR'));
		}
		if (!participant) {
			return failure(new ResourceNotFoundError('Participant not fount', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		const isUserOwner = room.ownerId?.toString() === userId;

		if (!isUserOwner) {
			return failure(
				new ForbiddenError(
					"You cannot remove a participant from a room that doesn't belongs to you",
					'INSUFFICIENT_PERMISSION_ERROR'
				)
			);
		}

		await this.participantsRepository.delete(participant);

		return success(null);
	}
}
