import { inject, injectable } from 'tsyringe';

import { Outcome, success } from '@/core/outcome';
import { Friendship } from '@/domains/chat/models/entities/friendship';
import { IFriendshipRepository } from '../repositories/friendship-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	userId: string;
}

type Response = Outcome<null, { friendships: Array<Friendship> }>;

@injectable()
export class ListingUserFriendsUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.FRIENDSHIPS_REPOSITORY) private friendShipsRepository: IFriendshipRepository
	) {}

	async execute({ userId }: IRequest): Promise<Response> {
		const friendships = await this.friendShipsRepository.findManyByUserId(userId);

		return success({ friendships });
	}
}
