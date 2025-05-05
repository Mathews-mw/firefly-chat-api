import { prisma } from '../prisma';
import { Friendship } from '@/domains/chat/models/entities/friendship';
import { FriendshipMapper } from '../mappers/friendship/friendship-mapper';
import {
	IFindUniqueQuery,
	IFriendshipRepository,
} from '@/domains/chat/application/features/friendships/repositories/friendship-repository';

export class PrismaFriendshipsRepository implements IFriendshipRepository {
	async create(friendship: Friendship) {
		const data = FriendshipMapper.toPrisma(friendship);

		await prisma.friendship.create({
			data,
		});

		return friendship;
	}

	async createMany(relations: Friendship[]): Promise<number> {
		const data = relations.map(FriendshipMapper.toPrisma);

		const result = await prisma.friendship.createMany({
			data,
		});

		return result.count;
	}

	async update(friendship: Friendship) {
		const data = FriendshipMapper.toPrisma(friendship);

		await prisma.friendship.update({
			data,
			where: {
				id: data.id,
			},
		});

		return friendship;
	}

	async delete(friendship: Friendship) {
		await prisma.friendship.delete({
			where: {
				id: friendship.id.toString(),
			},
		});
	}

	async findManyByUserId(userId: string): Promise<Friendship[]> {
		const friendships = await prisma.friendship.findMany({
			where: {
				userId,
			},
		});

		return friendships.map(FriendshipMapper.toDomain);
	}

	async findById(id: string) {
		const friendship = await prisma.friendship.findUnique({
			where: {
				id,
			},
		});

		if (!friendship) {
			return null;
		}

		return FriendshipMapper.toDomain(friendship);
	}

	async findUnique({ userId, friendId }: IFindUniqueQuery): Promise<Friendship | null> {
		const friendship = await prisma.friendship.findUnique({
			where: {
				userId_friendId: {
					userId,
					friendId,
				},
			},
		});

		if (!friendship) {
			return null;
		}

		return FriendshipMapper.toDomain(friendship);
	}
}
