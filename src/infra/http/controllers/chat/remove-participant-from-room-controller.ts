import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { RemoveParticipantFromRoomUseCase } from '@/domains/chat/application/features/chat/use-cases/remove-participant-from-room-use-case';
import {
	RemoveParticipantFromRoomParams,
	RemoveParticipantFromRoomRequest,
} from '../../schemas/chat/remove-participant-from-room-schema';

export async function removeParticipantFromRoomController(request: FastifyRequest, reply: FastifyReply) {
	const { roomId } = request.params as RemoveParticipantFromRoomParams;
	const { participant_id } = request.body as RemoveParticipantFromRoomRequest;
	const { sub } = request.user;

	const service = container.resolve(RemoveParticipantFromRoomUseCase);

	const result = await service.execute({
		userId: sub,
		roomId,
		participantId: participant_id,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send({ message: 'Participant removed successfully' });
}
