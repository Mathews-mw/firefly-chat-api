import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { CreateRoomRequest } from '../../schemas/chat/create-room-schema';
import { CreateRoomUseCase } from '@/domains/chat/application/features/chat/use-cases/create-room-use-case';

export async function createRoomController(request: FastifyRequest, reply: FastifyReply) {
	const { guest_id } = request.body as CreateRoomRequest;
	const { sub } = request.user;

	const service = container.resolve(CreateRoomUseCase);

	const result = await service.execute({
		userId: sub,
		guestId: guest_id,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(201).send({ message: 'Room created successfully', room_id: result.value.room.id.toString() });
}
