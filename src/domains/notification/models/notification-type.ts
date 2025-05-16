import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface INotificationTypeProps {
	key: string;
	label: string;
}

export class NotificationType extends Entity<INotificationTypeProps> {
	get key() {
		return this.props.key;
	}

	set key(key: string) {
		this.props.key = key;
	}

	get label() {
		return this.props.label;
	}

	set label(label: string) {
		this.props.label = label;
	}

	static create(props: INotificationTypeProps, id?: UniqueEntityId) {
		const notificationType = new NotificationType(props, id);

		return notificationType;
	}
}
