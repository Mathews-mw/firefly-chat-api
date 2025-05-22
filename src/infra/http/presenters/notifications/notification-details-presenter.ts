import { NotificationTypePresenter } from './notification-type-presenter';
import { NotificationDetails } from '@/domains/notification/models/value-objects/notification-details';

export class NotificationDetailsPresenter {
	static toHTTP(data: NotificationDetails<{ title: string; content: string; metadata?: {} | null }>) {
		return {
			id: data.id.toString(),
			recipient_id: data.recipientId.toString(),
			type: data.type,
			is_read: data.isRead,
			data: data.data,
			notification_type: NotificationTypePresenter.toHTTP(data.notificationType),
			created_at: data.createdAt,
		};
	}
}
