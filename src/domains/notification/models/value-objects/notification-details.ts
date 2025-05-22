import { INotificationProps } from '../notification';
import { NotificationType } from '../notification-type';
import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Json } from '@/core/types/json';

export interface INotificationDetailsProps<TData = Json> extends INotificationProps<TData> {
	id: UniqueEntityId;
	notificationType: NotificationType;
}

export class NotificationDetails<TData = Json> extends ValueObject<INotificationDetailsProps<TData>> {
	get id() {
		return this.props.id;
	}

	get recipientId() {
		return this.props.recipientId;
	}

	get type() {
		return this.props.type;
	}

	get data() {
		return this.props.data;
	}

	get isRead() {
		return this.props.isRead;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get notificationType() {
		return this.props.notificationType;
	}

	static create<TData = Json>(props: INotificationDetailsProps<TData>) {
		const notificationDetails = new NotificationDetails(props);

		return notificationDetails;
	}
}
