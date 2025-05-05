import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { RejectInvitationParams } from '../../schemas/friendship/reject-invitation-schema';
import { RejectInvitationUseCase } from '@/domains/chat/application/features/friendships/use-cases/reject-invitation-use-case';

export async function rejectInvitationController(request: FastifyRequest, reply: FastifyReply) {
	const { invitationId } = request.params as RejectInvitationParams;

	const service = container.resolve(RejectInvitationUseCase);

	const result = await service.execute({
		invitationId,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send({ message: result.value.message });
}
