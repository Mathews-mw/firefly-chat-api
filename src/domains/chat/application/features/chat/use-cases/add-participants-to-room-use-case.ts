import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { ForbiddenError } from '@/core/errors/forbidden-error';
import { IRoomRepository } from '../repositories/room-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Participant } from '@/domains/chat/models/entities/participant';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { IParticipantRepository } from '../repositories/participant-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	userId: string;
	roomId: string;
	participantIds: Array<string>;
}

type Response = Outcome<ForbiddenError | ResourceNotFoundError, null>;

@injectable()
export class AddParticipantsToRoomUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.ROOMS_REPOSITORY) private roomsRepository: IRoomRepository,
		@inject(DEPENDENCY_IDENTIFIERS.PARTICIPANTS_REPOSITORY) private participantsRepository: IParticipantRepository
	) {}

	async execute({ userId, roomId, participantIds }: IRequest): Promise<Response> {
		const room = await this.roomsRepository.findById(roomId);

		if (!room) {
			return failure(new ResourceNotFoundError('Room not fount', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		const isUserOwner = room.ownerId?.toString() === userId;

		if (!isUserOwner) {
			return failure(
				new ForbiddenError("You cannot invite to a room that doesn't belongs to you", 'INSUFFICIENT_PERMISSION_ERROR')
			);
		}

		const participantsToCreate = participantIds.map((id) => {
			return Participant.create({
				roomId: room.id,
				userId: new UniqueEntityId(id),
			});
		});

		await this.participantsRepository.createMany(participantsToCreate);

		return success(null);
	}
}
