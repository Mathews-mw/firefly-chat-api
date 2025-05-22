import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { AddParticipantsToRoomUseCase } from '@/domains/chat/application/features/chat/use-cases/add-participants-to-room-use-case';
import {
	AddParticipantsToRoomParams,
	AddParticipantsToRoomRequest,
} from '../../schemas/chat/add-participants-to-room-schema';

export async function addParticipantsToRoomController(request: FastifyRequest, reply: FastifyReply) {
	const { roomId } = request.params as AddParticipantsToRoomParams;
	const { participant_ids } = request.body as AddParticipantsToRoomRequest;
	const { sub } = request.user;

	const service = container.resolve(AddParticipantsToRoomUseCase);

	const result = await service.execute({
		userId: sub,
		roomId,
		participantIds: participant_ids,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send({ message: 'Participants added successfully' });
}
