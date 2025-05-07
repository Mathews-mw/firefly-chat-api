import { Friendship } from '@/domains/chat/models/entities/friendship';
import { IPaginationParams, IPaginationResponse } from '@/core/interfaces/paginating-interfaces';
import { FriendshipWithFriend } from '@/domains/chat/models/entities/value-objects/friendship-with-friend';

export interface IFindUniqueQuery {
	userId: string;
	friendId: string;
}

export interface IFindManyByUserQuery extends IPaginationParams {
	userId: string;
	search?: string;
}

export interface IFindManyByUserResponse {
	pagination: IPaginationResponse;
	friendships: Array<FriendshipWithFriend>;
}

export interface IFriendshipRepository {
	create(friendship: Friendship): Promise<Friendship>;
	createMany(relations: Friendship[]): Promise<number>;
	update(friendship: Friendship): Promise<Friendship>;
	delete(friendship: Friendship): Promise<void>;
	findManyByUserId(query: IFindManyByUserQuery): Promise<IFindManyByUserResponse>;
	findById(id: string): Promise<Friendship | null>;
	findUnique(params: IFindUniqueQuery): Promise<Friendship | null>;
}
