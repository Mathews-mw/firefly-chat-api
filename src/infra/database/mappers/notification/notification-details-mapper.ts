import { JsonValue } from '@/core/types/json';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotificationTypeMapper } from './notification-type-mapper';
import { NotificationDetails } from '@/domains/notification/models/value-objects/notification-details';
import {
	Notification as PrismaNotification,
	NotificationType as PrismaNotificationType,
} from 'prisma/generated/client';

type INotificationDetails = PrismaNotification & {
	notificationType: PrismaNotificationType;
};

export class NotificationDetailsMapper {
	static toDomain(data: INotificationDetails): NotificationDetails {
		return NotificationDetails.create({
			id: new UniqueEntityId(data.id),
			userId: new UniqueEntityId(data.userId),
			type: data.type,
			data: data.data as JsonValue,
			isRead: data.isRead,
			createdAt: data.createdAt,
			notificationType: NotificationTypeMapper.toDomain(data.notificationType),
		});
	}
}
