import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { InvitationWithReceiverPresenter } from '../../presenters/friendships/invitation-with-receiver-presenter';
import { ListingUserSentInvitationsUseCase } from '@/domains/chat/application/features/friendships/use-cases/listing-user-sent-invitations-use-case';

export async function listingUserSentInvitationsController(request: FastifyRequest, reply: FastifyReply) {
	const { sub } = request.user;

	const service = container.resolve(ListingUserSentInvitationsUseCase);

	const result = await service.execute({
		meId: sub,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send(result.value.invitations.map(InvitationWithReceiverPresenter.toHTTP));
}
