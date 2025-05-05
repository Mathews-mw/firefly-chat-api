import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { FriendshipPresenter } from '../../presenters/friendships/friendship-presenter';
import { ListingUserFriendsUseCase } from '@/domains/chat/application/features/friendships/use-cases/listing-user-friends-use-case';

export async function listingUserFriendsController(request: FastifyRequest, reply: FastifyReply) {
	const { sub } = request.user;

	const service = container.resolve(ListingUserFriendsUseCase);

	const result = await service.execute({
		userId: sub,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send(result.value.friendships.map(FriendshipPresenter.toHTTP));
}
