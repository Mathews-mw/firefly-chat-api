import { NotificationType } from '@/domains/notification/models/notification-type';
import { NotificationType as PrismaNotificationType } from 'prisma/generated/client';

export class NotificationTypeMapper {
	static toDomain(data: PrismaNotificationType): NotificationType {
		return NotificationType.create({
			key: data.key,
			label: data.label,
		});
	}

	static toPrisma(data: NotificationType): PrismaNotificationType {
		return {
			key: data.key,
			label: data.label,
		};
	}
}
