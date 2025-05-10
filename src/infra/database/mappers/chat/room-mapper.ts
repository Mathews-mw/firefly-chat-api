import { Room } from '@/domains/chat/models/entities/room';
import { Room as PrismaRoom } from 'prisma/generated/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export class RoomMapper {
	static toDomain(data: PrismaRoom): Room {
		return Room.create(
			{
				type: data.type,
				createdAt: data.createdAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: Room): PrismaRoom {
		return {
			id: data.id.toString(),
			type: data.type,
			createdAt: data.createdAt,
		};
	}
}
