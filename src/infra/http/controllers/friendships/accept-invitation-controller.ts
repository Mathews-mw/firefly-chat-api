import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { AcceptInvitationParams } from '../../schemas/friendship/accept-invitation-schema';
import { AcceptInvitationUseCase } from '@/domains/chat/application/features/friendships/use-cases/accept-invitation-use-case';

export async function acceptInvitationController(request: FastifyRequest, reply: FastifyReply) {
	const { invitationId } = request.params as AcceptInvitationParams;

	const service = container.resolve(AcceptInvitationUseCase);

	const result = await service.execute({
		invitationId,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send({ message: result.value.message });
}
