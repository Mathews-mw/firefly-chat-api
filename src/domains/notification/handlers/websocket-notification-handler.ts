import { inject, injectable } from 'tsyringe';

import { EventHandler } from '@/core/events/event-bus';
import { NotificationType } from '../models/notification-type';
import { NotificationCreateEvent } from '../events/notification-create-event';
import { NotificationDetails } from '../models/value-objects/notification-details';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { NotificationPublisher } from '@/infra/websocket/publishers/notification-publisher ';
import { INotificationRepository } from '../application/features/notifications/repositories/notification-repository';

@injectable()
export class WebsocketNotificationHandler implements EventHandler<NotificationCreateEvent> {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.NOTIFICATION_PUBLISHER) private publisher: NotificationPublisher,
		@inject(DEPENDENCY_IDENTIFIERS.NOTIFICATIONS_REPOSITORY) private notificationsRepository: INotificationRepository
	) {}

	async handler(event: NotificationCreateEvent): Promise<void> {
		const { notification } = event;

		const notificationType = await this.notificationsRepository.getNotificationType(notification.type);

		const notificationDetails = NotificationDetails.create<{ title: string; content: string; metadata?: {} | null }>({
			id: notification.id,
			recipientId: notification.recipientId,
			type: notification.type,
			data: notification.data as { title: string; content: string; metadata?: {} | null },
			isRead: notification.isRead,
			createdAt: notification.createdAt,
			notificationType: notificationType
				? notificationType
				: NotificationType.create({ key: 'OTHERS', label: 'Outros' }),
		});

		this.publisher.publishTo(notification.recipientId.toString(), {
			notification: notificationDetails,
		});
	}
}
