import z from 'zod';

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const roomTypeSchema = z.union([z.literal('PRIVATE'), z.literal('GROUP')]);

export type RoomType = z.infer<typeof roomTypeSchema>;

export interface IRoomProps {
	type: RoomType;
	name?: string | null;
	description?: string | null;
	imageUrl?: string | null;
	ownerId?: UniqueEntityId | null;
	createdAt: Date;
}

export class Room extends Entity<IRoomProps> {
	get type() {
		return this.props.type;
	}

	set type(type: RoomType) {
		this.props.type = type;
	}

	get name() {
		return this.props.name;
	}

	set name(name: string | null | undefined) {
		this.props.name = name;
	}

	get description() {
		return this.props.description;
	}

	set description(description: string | null | undefined) {
		this.props.description = description;
	}

	get imageUrl() {
		return this.props.imageUrl;
	}

	set imageUrl(imageUrl: string | null | undefined) {
		this.props.imageUrl = imageUrl;
	}

	get ownerId() {
		return this.props.ownerId;
	}

	set ownerId(ownerId: UniqueEntityId | null | undefined) {
		this.props.ownerId = ownerId;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	static create(props: Optional<IRoomProps, 'createdAt' | 'type'>, id?: UniqueEntityId) {
		const room = new Room(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
				type: props.type ?? 'PRIVATE',
			},
			id
		);

		return room;
	}
}
