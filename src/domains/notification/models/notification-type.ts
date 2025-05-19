import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { z } from 'zod';

export const invitationTypeKeySchema = z.union([z.literal('FRIEND_REQUEST'), z.literal('FRIEND_ACCEPTED')]);

export type IInvitationTypeKey = z.infer<typeof invitationTypeKeySchema>;

export interface INotificationTypeProps {
	key: IInvitationTypeKey;
	label: string;
}

export class NotificationType extends Entity<INotificationTypeProps> {
	get key() {
		return this.props.key;
	}

	set key(key: IInvitationTypeKey) {
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
