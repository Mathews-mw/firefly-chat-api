import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { GetRoomParams, GetRoomQuery, GetRoomResponse } from '../../schemas/chat/get-room-schema';
import { GetRoomUseCase } from '@/domains/chat/application/features/chat/use-cases/get-room-use-case';
import { RoomWithParticipantsPresenter } from '../../presenters/chat/room-with-participants-presenter';

export async function getRoomController(request: FastifyRequest, reply: FastifyReply) {
	const { roomId } = request.params as GetRoomParams;
	const { type, user_id } = request.query as GetRoomQuery;

	const service = container.resolve(GetRoomUseCase);

	const result = await service.execute({
		roomId,
		type,
		userId: user_id,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	const response: GetRoomResponse = RoomWithParticipantsPresenter.toHTTP(result.value.room);

	return reply.status(201).send(response);
}
