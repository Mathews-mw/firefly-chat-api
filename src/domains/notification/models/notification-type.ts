import { z } from 'zod';

import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const notificationTypeKeySchema = z.union([
	z.literal('FRIEND_REQUEST'),
	z.literal('FRIEND_ACCEPTED'),
	z.literal('REMINDER'),
	z.literal('NEWS'),
	z.literal('OTHERS'),
]);

export type INotificationTypeKey = z.infer<typeof notificationTypeKeySchema>;

export interface INotificationTypeProps {
	key: INotificationTypeKey;
	label: string;
}

export class NotificationType extends Entity<INotificationTypeProps> {
	get key() {
		return this.props.key;
	}

	set key(key: INotificationTypeKey) {
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
