import { prisma } from '../prisma';
import { RoomMapper } from '../mappers/chat/room-mapper';
import { Room } from '@/domains/chat/models/entities/room';
import { RoomDetailsMapper } from '../mappers/chat/room-details-mapper';
import { RoomWithParticipantsMapper } from '../mappers/chat/room-with-participants-mapper';
import { RoomWithParticipants } from '@/domains/chat/models/entities/value-objects/room-with-participants';
import {
	IFindUniqueParams,
	IRoomRepository,
	IFindManyRoomsByUserSearchCursor,
	IWithParticipantsParams,
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

	async findManyByUser({ limit, cursor, skip, userId, type }: IFindManyRoomsByUserSearchCursor) {
		const rooms = await prisma.room.findMany({
			where: {
				type: type ?? 'PRIVATE',
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
						attachments: true,
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

	async findDetails(id: string, isPrivate?: boolean) {
		const room = await prisma.room.findUnique({
			where: {
				id,
				type: isPrivate ? 'PRIVATE' : 'GROUP',
			},
			include: {
				participants: {
					include: {
						user: true,
					},
				},
				attachments: true,
			},
		});

		if (!room) {
			return null;
		}

		return RoomDetailsMapper.toDomain(room);
	}

	async findWithParticipants({ roomId, type, userId }: IWithParticipantsParams): Promise<RoomWithParticipants | null> {
		const room = await prisma.room.findUnique({
			where: {
				id: roomId,
				type: type ?? 'PRIVATE',
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
						attachments: true,
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

	async findUniqueByParticipants({ firstSubjectId, secondSubjectId, type }: IFindUniqueParams) {
		const room = await prisma.room.findFirst({
			where: {
				type: type ?? 'PRIVATE',
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
						attachments: true,
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
