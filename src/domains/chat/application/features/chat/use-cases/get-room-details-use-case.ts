import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { ForbiddenError } from '@/core/errors/forbidden-error';
import { IRoomRepository } from '../repositories/room-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { RoomDetails } from '@/domains/chat/models/entities/value-objects/room-details';

interface IRequest {
	roomId: string;
	isPrivate?: boolean;
}

type Response = Outcome<ResourceNotFoundError | ForbiddenError, { room: RoomDetails }>;

@injectable()
export class GetRoomDetailsUseCase {
	constructor(@inject(DEPENDENCY_IDENTIFIERS.ROOMS_REPOSITORY) private roomsRepository: IRoomRepository) {}

	async execute({ roomId, isPrivate }: IRequest): Promise<Response> {
		const room = await this.roomsRepository.findDetails(roomId, isPrivate);

		if (!room) {
			return failure(new ResourceNotFoundError('Room not found', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		return success({ room });
	}
}
