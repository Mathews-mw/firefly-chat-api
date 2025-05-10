import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { PaginationPresenter } from '../../presenters/pagination-presenter';
import { RoomWithParticipantsPresenter } from '../../presenters/chat/room-with-participants-presenter';
import { ListingUserPrivateRoomsUseCase } from '@/domains/chat/application/features/chat/use-cases/listing-user-private-rooms-use-case';
import {
	ListingUserPrivateRoomsQuery,
	ListingUserPrivateRoomsResponse,
} from '../../schemas/chat/listing-user-private-rooms-schema';

export async function listingUserPrivateRooms(request: FastifyRequest, reply: FastifyReply) {
	const { limit, cursor, skip } = request.query as ListingUserPrivateRoomsQuery;
	const { sub } = request.user;

	const service = container.resolve(ListingUserPrivateRoomsUseCase);

	const result = await service.execute({
		limit,
		cursor,
		skip,
		userId: sub,
	});

	if (result.isFalse()) {
		throw result.value;
	}
	const response: ListingUserPrivateRoomsResponse = {
		cursor: PaginationPresenter.cursorModeToHTTP(result.value.cursor),
		rooms: result.value.rooms.map(RoomWithParticipantsPresenter.toHTTP),
	};

	return reply.status(200).send(response);
}
