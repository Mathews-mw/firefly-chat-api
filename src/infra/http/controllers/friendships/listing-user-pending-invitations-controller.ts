import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { InvitationWithSenderPresenter } from '../../presenters/friendships/invitation-with-sender-presenter';
import { ListingUserPendingInvitationsUseCase } from '@/domains/chat/application/features/friendships/use-cases/listing-user-pending-invitations-use-case';

export async function listingUserPendingInvitationsController(request: FastifyRequest, reply: FastifyReply) {
	const { sub } = request.user;

	const service = container.resolve(ListingUserPendingInvitationsUseCase);

	const result = await service.execute({
		meId: sub,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send(result.value.invitations.map(InvitationWithSenderPresenter.toHTTP));
}
