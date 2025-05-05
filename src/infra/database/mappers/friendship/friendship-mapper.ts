import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Friendship } from '@/domains/chat/models/entities/friendship';
import { Friendship as PrismaFriendship } from 'prisma/generated/client';

export class FriendshipMapper {
	static toDomain(data: PrismaFriendship): Friendship {
		return Friendship.create(
			{
				userId: new UniqueEntityId(data.userId),
				friendId: new UniqueEntityId(data.friendId),
				createdAt: data.createdAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: Friendship): PrismaFriendship {
		return {
			id: data.id.toString(),
			userId: data.userId.toString(),
			friendId: data.friendId.toString(),
			createdAt: data.createdAt,
		};
	}
}
