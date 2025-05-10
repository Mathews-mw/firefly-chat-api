import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { ForbiddenError } from '@/core/errors/forbidden-error';
import { RoomType } from '@/domains/chat/models/entities/room';
import { IRoomRepository } from '../repositories/room-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { RoomWithParticipants } from '@/domains/chat/models/entities/value-objects/room-with-participants';

interface IRequest {
	roomId: string;
	userId?: string;
	type: RoomType;
}

type Response = Outcome<ResourceNotFoundError | ForbiddenError, { room: RoomWithParticipants }>;

@injectable()
export class GetRoomUseCase {
	constructor(@inject(DEPENDENCY_IDENTIFIERS.ROOMS_REPOSITORY) private roomsRepository: IRoomRepository) {}

	async execute({ roomId, type, userId }: IRequest): Promise<Response> {
		const room = await this.roomsRepository.findDetails({ roomId, type, userId });

		if (!room) {
			return failure(new ResourceNotFoundError('Room not found', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		return success({ room });
	}
}
