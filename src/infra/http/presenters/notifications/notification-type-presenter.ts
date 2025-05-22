import { NotificationType } from '@/domains/notification/models/notification-type';

export class NotificationTypePresenter {
	static toHTTP(data: NotificationType) {
		return {
			key: data.key,
			label: data.label,
		};
	}
}
