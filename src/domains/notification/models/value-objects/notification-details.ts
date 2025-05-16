import { INotificationProps } from '../notification';
import { NotificationType } from '../notification-type';
import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface INotificationDetailsProps extends INotificationProps {
	id: UniqueEntityId;
	notificationType: NotificationType;
}

export class NotificationDetails extends ValueObject<INotificationDetailsProps> {
	get id() {
		return this.props.id;
	}

	get userId() {
		return this.props.userId;
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

	static create(props: INotificationDetailsProps) {
		const notificationDetails = new NotificationDetails(props);

		return notificationDetails;
	}
}
