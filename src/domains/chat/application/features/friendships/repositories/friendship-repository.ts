import { Friendship } from '@/domains/chat/models/entities/friendship';

export interface IFindUniqueQuery {
	userId: string;
	friendId: string;
}

export interface IFriendshipRepository {
	create(friendship: Friendship): Promise<Friendship>;
	createMany(relations: Friendship[]): Promise<number>;
	update(friendship: Friendship): Promise<Friendship>;
	delete(friendship: Friendship): Promise<void>;
	findManyByUserId(userId: string): Promise<Friendship[]>;
	findById(id: string): Promise<Friendship | null>;
	findUnique(params: IFindUniqueQuery): Promise<Friendship | null>;
}
