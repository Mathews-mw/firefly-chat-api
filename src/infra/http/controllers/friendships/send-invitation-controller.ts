import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { SendInvitationRequest } from '../../schemas/friendship/send-invitation-schema';
import { SendInvitationUseCase } from '@/domains/chat/application/features/friendships/use-cases/send-invitation-use-case';

export async function sendInvitationController(request: FastifyRequest, reply: FastifyReply) {
	const { username } = request.body as SendInvitationRequest;

	const { sub } = request.user;

	const service = container.resolve(SendInvitationUseCase);

	const result = await service.execute({
		senderId: sub,
		username,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply
		.status(201)
		.send({ message: 'Invitation sent successfully', invitation_id: result.value.invitation.id.toString() });
}
