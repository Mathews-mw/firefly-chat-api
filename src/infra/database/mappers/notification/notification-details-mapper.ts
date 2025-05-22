import { Json } from '@/core/types/json';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotificationTypeMapper } from './notification-type-mapper';
import { NotificationDetails } from '@/domains/notification/models/value-objects/notification-details';
import {
	Notification as PrismaNotification,
	NotificationType as PrismaNotificationType,
} from 'prisma/generated/client';
import { INotificationTypeKey } from '@/domains/notification/models/notification-type';

type INotificationDetails = PrismaNotification & {
	notificationType: PrismaNotificationType;
};

export class NotificationDetailsMapper {
	static toDomain(data: INotificationDetails): NotificationDetails {
		return NotificationDetails.create({
			id: new UniqueEntityId(data.id),
			recipientId: new UniqueEntityId(data.recipientId),
			type: data.type as INotificationTypeKey,
			data: data.data as Json,
			isRead: data.isRead,
			createdAt: data.createdAt,
			notificationType: NotificationTypeMapper.toDomain(data.notificationType),
		});
	}
}
