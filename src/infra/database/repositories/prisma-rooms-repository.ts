import { prisma } from '../prisma';
import { RoomMapper } from '../mappers/chat/room-mapper';
import { Room } from '@/domains/chat/models/entities/room';
import { RoomWithParticipantsMapper } from '../mappers/chat/room-with-participants-mapper';
import {
	IFindUniqueParams,
	IRoomRepository,
	IFindDetailsParams,
	IFindManyRoomsByUserSearchCursor,
} from '@/domains/chat/application/features/chat/repositories/room-repository';

export class PrismaRoomsRepository implements IRoomRepository {
	async create(room: Room) {
		const data = RoomMapper.toPrisma(room);

		await prisma.room.create({
			data,
		});

		return room;
	}

	async update(room: Room) {
		const data = RoomMapper.toPrisma(room);

		await prisma.room.update({
			data,
			where: {
				id: data.id,
			},
		});

		return room;
	}

	async delete(room: Room) {
		await prisma.room.delete({
			where: {
				id: room.id.toString(),
			},
		});
	}

	async findMany() {
		const rooms = await prisma.room.findMany({});

		return rooms.map(RoomMapper.toDomain);
	}

	async findManyByUser({ limit, cursor, skip, userId }: IFindManyRoomsByUserSearchCursor) {
		const rooms = await prisma.room.findMany({
			where: {
				type: 'PRIVATE',
				participants: { some: { userId } },
			},
			include: {
				participants: {
					where: { userId: { not: userId } },
					include: { user: true },
				},
				chatMessages: {
					include: {
						author: true,
						readReceipts: true,
					},
					take: 1,
					orderBy: {
						createdAt: 'desc',
					},
				},
			},
			skip,
			take: limit + 1,
			cursor: cursor
				? {
						id: cursor,
					}
				: undefined,
			orderBy: {
				createdAt: 'desc',
			},
		});

		let nextCursor: string | undefined;
		let previousCursor: string | undefined;
		let hasMore = true;

		if (rooms.length > limit) {
			hasMore = true;
			previousCursor = rooms[0].id;

			const nextItem = rooms.pop();
			nextCursor = nextItem?.id;
		} else {
			hasMore = false;
		}

		return {
			nextCursor,
			previousCursor,
			hasMore,
			rooms: rooms.map(RoomWithParticipantsMapper.toDomain),
		};
	}

	async findById(id: string) {
		const room = await prisma.room.findUnique({
			where: {
				id,
			},
		});

		if (!room) {
			return null;
		}

		return RoomMapper.toDomain(room);
	}

	async findDetails({ roomId, type, userId }: IFindDetailsParams) {
		const room = await prisma.room.findUnique({
			where: {
				id: roomId,
				type,
			},
			include: {
				participants: {
					where: { userId: { not: userId } },
					include: { user: true },
				},
				chatMessages: {
					include: {
						author: true,
						readReceipts: true,
					},
					take: 1,
					orderBy: {
						createdAt: 'desc',
					},
				},
			},
		});

		if (!room) {
			return null;
		}

		return RoomWithParticipantsMapper.toDomain(room);
	}

	async findUniqueByParticipants({ firstSubjectId, secondSubjectId }: IFindUniqueParams) {
		const room = await prisma.room.findFirst({
			where: {
				type: 'PRIVATE',
				participants: {
					every: {
						userId: {
							in: [firstSubjectId, secondSubjectId],
						},
					},
				},
			},
			include: {
				participants: {
					include: {
						user: true,
					},
				},
				chatMessages: {
					include: {
						author: true,
						readReceipts: true,
					},
					take: 1,
					orderBy: {
						createdAt: 'desc',
					},
				},
			},
		});

		if (!room) {
			return null;
		}

		return RoomWithParticipantsMapper.toDomain(room);
	}
}
