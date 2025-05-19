import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Json } from '@/core/types/json';

export interface INotificationProps<TData = Json> {
	recipientId: UniqueEntityId;
	type: string;
	data: TData;
	isRead: boolean;
	createdAt: Date;
}

export class Notification<TData = Json> extends Entity<INotificationProps<TData>> {
	get recipientId() {
		return this.props.recipientId;
	}

	set recipientId(recipientId: UniqueEntityId) {
		this.props.recipientId = recipientId;
	}

	get type() {
		return this.props.type;
	}

	set type(type: string) {
		this.props.type = type;
	}

	get data(): TData {
		return this.props.data;
	}

	set data(data: TData) {
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

	static create<TData = Json>(props: Optional<INotificationProps<TData>, 'isRead' | 'createdAt'>, id?: UniqueEntityId) {
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
