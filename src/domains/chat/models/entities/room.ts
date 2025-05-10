import z from 'zod';

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const roomTypeSchema = z.union([z.literal('PRIVATE'), z.literal('GROUP')]);

export type RoomType = z.infer<typeof roomTypeSchema>;

export interface IRoomProps {
	type: RoomType;
	createdAt: Date;
}

export class Room extends Entity<IRoomProps> {
	get type() {
		return this.props.type;
	}

	set type(type: RoomType) {
		this.props.type = type;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	static create(props: Optional<IRoomProps, 'createdAt' | 'type'>, id?: UniqueEntityId) {
		const room = new Room(
			{
				...props,
				createdAt: new Date(),
				type: props.type ?? 'PRIVATE',
			},
			id
		);

		return room;
	}
}
