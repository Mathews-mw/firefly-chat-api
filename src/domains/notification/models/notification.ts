import { JsonValue } from '@/core/types/json';
import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface INotificationProps {
	userId: UniqueEntityId;
	type: string;
	data: JsonValue;
	isRead: boolean;
	createdAt: Date;
}

export class Notification extends Entity<INotificationProps> {
	get userId() {
		return this.props.userId;
	}

	set userId(userId: UniqueEntityId) {
		this.props.userId = userId;
	}

	get type() {
		return this.props.type;
	}

	set type(type: string) {
		this.props.type = type;
	}

	get data() {
		return this.props.data;
	}

	set data(data: JsonValue) {
		this.props.data = data;
	}

	get isRead() {
		return this.props.isRead;
	}

	set isRead(isRead: boolean) {
		this.props.isRead = isRead;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	static create(props: Optional<INotificationProps, 'isRead' | 'createdAt'>, id?: UniqueEntityId) {
		const notification = new Notification(
			{
				...props,
				isRead: props.isRead ?? false,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return notification;
	}
}
