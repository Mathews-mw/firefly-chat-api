import { Json } from '@/core/types/json';
import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { INotificationTypeKey } from './notification-type';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotificationCreateEvent } from '../events/notification-create-event';

export interface INotificationProps<TData = Json> {
	recipientId: UniqueEntityId;
	type: INotificationTypeKey;
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

	set type(type: INotificationTypeKey) {
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

		const isNewNotification = !id;

		if (isNewNotification) {
			notification.addDomainEvent(new NotificationCreateEvent(notification));
		}

		return notification;
	}
}
