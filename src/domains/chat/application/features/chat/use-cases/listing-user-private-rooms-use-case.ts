import { inject, injectable } from 'tsyringe';

import { Outcome, success } from '@/core/outcome';
import { IRoomRepository } from '../repositories/room-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { ICursorParams, ICursorResponse } from '@/core/interfaces/paginating-interfaces';
import { RoomWithParticipants } from '@/domains/chat/models/entities/value-objects/room-with-participants';

interface IRequest extends ICursorParams {
	userId: string;
}

type Response = Outcome<null, { cursor: ICursorResponse; rooms: Array<RoomWithParticipants> }>;

@injectable()
export class ListingUserPrivateRoomsUseCase {
	constructor(@inject(DEPENDENCY_IDENTIFIERS.ROOMS_REPOSITORY) private roomsRepository: IRoomRepository) {}

	async execute({ limit, cursor, skip, userId }: IRequest): Promise<Response> {
		const { hasMore, rooms, nextCursor, previousCursor } = await this.roomsRepository.findManyByUser({
			limit,
			cursor,
			skip,
			userId,
		});

		return success({ rooms, cursor: { hasMore, nextCursor, previousCursor } });
	}
}
