import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { PaginationPresenter } from '../../presenters/pagination-presenter';
import { RoomWithParticipantsPresenter } from '../../presenters/chat/room-with-participants-presenter';
import { ListingUserRoomsQuery, ListingUserRoomsResponse } from '../../schemas/chat/listing-user-rooms-schema';
import { ListingUserRoomsUseCase } from '@/domains/chat/application/features/chat/use-cases/listing-user-rooms-use-case';

export async function listingUserRoomsController(request: FastifyRequest, reply: FastifyReply) {
	const { limit, cursor, skip, type } = request.query as ListingUserRoomsQuery;
	const { sub } = request.user;

	const service = container.resolve(ListingUserRoomsUseCase);

	const result = await service.execute({
		limit,
		cursor,
		skip,
		userId: sub,
		type,
	});

	if (result.isFalse()) {
		throw result.value;
	}
	const response: ListingUserRoomsResponse = {
		cursor: PaginationPresenter.cursorModeToHTTP(result.value.cursor),
		rooms: result.value.rooms.map(RoomWithParticipantsPresenter.toHTTP),
	};

	return reply.status(200).send(response);
}
