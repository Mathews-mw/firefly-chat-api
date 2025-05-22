import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { CreateGroupRoomRequest } from '../../schemas/chat/create-group-room-schema';
import { CreateGroupRoomUseCase } from '@/domains/chat/application/features/chat/use-cases/create-group-room-use-case';

export async function createGroupRoomController(request: FastifyRequest, reply: FastifyReply) {
	const { name, description, image_url } = request.body as CreateGroupRoomRequest;
	const { sub } = request.user;

	const service = container.resolve(CreateGroupRoomUseCase);

	const result = await service.execute({
		userId: sub,
		name,
		description,
		imageUrl: image_url,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(201).send({ message: 'Room created successfully', room_id: result.value.room.id.toString() });
}
