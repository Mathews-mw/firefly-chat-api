import { UserMapper } from '../user/user-mapper';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Friendship as PrismaFriendship, User as PrismaUser } from 'prisma/generated/client';
import { FriendshipWithFriend } from '@/domains/chat/models/entities/value-objects/friendship-with-friend';

type IFriendshipWithFriend = PrismaFriendship & {
	friend: PrismaUser;
};

export class FriendshipWithFriendMapper {
	static toDomain(data: IFriendshipWithFriend): FriendshipWithFriend {
		return FriendshipWithFriend.create({
			id: new UniqueEntityId(data.id),
			userId: new UniqueEntityId(data.userId),
			friendId: new UniqueEntityId(data.friendId),
			createdAt: data.createdAt,
			friend: UserMapper.toDomain(data.friend),
		});
	}
}
