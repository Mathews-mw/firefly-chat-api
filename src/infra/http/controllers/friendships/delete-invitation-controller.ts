import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { DeleteInvitationParams } from '../../schemas/friendship/delete-invitation-schema';
import { DeleteInvitationUseCase } from '@/domains/chat/application/features/friendships/use-cases/delete-invitation-use-case';

export async function deleteInvitationController(request: FastifyRequest, reply: FastifyReply) {
	const { invitationId } = request.params as DeleteInvitationParams;
	const { sub } = request.user;

	const service = container.resolve(DeleteInvitationUseCase);

	const result = await service.execute({
		invitationId,
		inviteOwnerId: sub,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send({ message: result.value.message });
}
