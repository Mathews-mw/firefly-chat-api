import { inject, injectable } from 'tsyringe';

import { Outcome, success } from '@/core/outcome';
import { IFriendshipRepository } from '../repositories/friendship-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { IPaginationParams, IPaginationResponse } from '@/core/interfaces/paginating-interfaces';
import { FriendshipWithFriend } from '@/domains/chat/models/entities/value-objects/friendship-with-friend';

interface IRequest extends IPaginationParams {
	userId: string;
	search?: string;
}

type Response = Outcome<null, { pagination: IPaginationResponse; friendships: Array<FriendshipWithFriend> }>;

@injectable()
export class ListingUserFriendsUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.FRIENDSHIPS_REPOSITORY) private friendShipsRepository: IFriendshipRepository
	) {}

	async execute({ page, perPage, userId, search }: IRequest): Promise<Response> {
		const { pagination, friendships } = await this.friendShipsRepository.findManyByUserId({
			page,
			perPage,
			userId,
			search,
		});

		return success({ pagination, friendships });
	}
}
