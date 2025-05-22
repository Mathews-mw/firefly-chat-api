import { Room } from '@/domains/chat/models/entities/room';
import { Room as PrismaRoom } from 'prisma/generated/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export class RoomMapper {
	static toDomain(data: PrismaRoom): Room {
		return Room.create(
			{
				type: data.type,
				name: data.name,
				description: data.description,
				imageUrl: data.imageUrl,
				ownerId: data.ownerId ? new UniqueEntityId(data.ownerId) : null,
				createdAt: data.createdAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: Room): PrismaRoom {
		return {
			id: data.id.toString(),
			type: data.type,
			description: data.description ?? null,
			imageUrl: data.imageUrl ?? null,
			name: data.name ?? null,
			ownerId: data.ownerId ? data.ownerId.toString() : null,
			createdAt: data.createdAt,
		};
	}
}
