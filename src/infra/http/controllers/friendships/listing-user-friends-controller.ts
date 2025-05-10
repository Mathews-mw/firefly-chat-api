import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { PaginationPresenter } from '../../presenters/pagination-presenter';
import { ListingUserFriendsQuery } from '../../schemas/friendship/listing-user-friends-schema';
import { FriendshipWithPresenterPresenter } from '../../presenters/friendships/friendship-with-friend-presenter';
import { ListingUserFriendsUseCase } from '@/domains/chat/application/features/friendships/use-cases/listing-user-friends-use-case';

export async function listingUserFriendsController(request: FastifyRequest, reply: FastifyReply) {
	const { page, per_page, search } = request.query as ListingUserFriendsQuery;
	const { sub } = request.user;

	const service = container.resolve(ListingUserFriendsUseCase);

	const result = await service.execute({
		userId: sub,
		page,
		perPage: per_page,
		search,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	const response = {
		pagination: PaginationPresenter.paginationModeToHTTP(result.value.pagination),
		friends: result.value.friendships.map(FriendshipWithPresenterPresenter.toHTTP),
	};

	return reply.status(200).send(response);
}
