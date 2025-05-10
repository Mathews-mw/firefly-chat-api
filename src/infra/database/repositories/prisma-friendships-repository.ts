import { prisma } from '../prisma';
import { Prisma } from 'prisma/generated/client';
import { Friendship } from '@/domains/chat/models/entities/friendship';
import { FriendshipMapper } from '../mappers/friendship/friendship-mapper';
import { FriendshipWithFriendMapper } from '../mappers/friendship/friendship-with-friend-mapper';
import {
	IFindManyByUserQuery,
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

	async findManyByUserId({ page, perPage, userId, search }: IFindManyByUserQuery) {
		const query: Prisma.FriendshipFindManyArgs = {
			where: {
				userId,
				friend: {
					name: {
						contains: search,
						mode: 'insensitive',
					},
				},
			},
		};

		const isPerPageNumber = typeof perPage === 'number';

		const [friendships, count] = await prisma.$transaction([
			prisma.friendship.findMany({
				where: query.where,
				include: {
					friend: true,
				},
				orderBy: {
					friend: {
						name: 'asc',
					},
				},
				take: isPerPageNumber ? perPage : undefined,
				skip: isPerPageNumber ? (page - 1) * perPage : undefined,
			}),
			prisma.friendship.count({
				where: query.where,
			}),
		]);

		let _perPage = isPerPageNumber ? perPage : 10;

		if (perPage === 'all') {
			_perPage = count;
		}

		const totalPages = Math.ceil(count / _perPage);

		const pagination = {
			page,
			perPage: _perPage,
			totalPages,
			totalOccurrences: count,
		};

		return {
			pagination,
			friendships: friendships.map(FriendshipWithFriendMapper.toDomain),
		};
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
