import { JsonValue } from '@/core/types/json';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Notification } from '@/domains/notification/models/notification';
import { Prisma, Notification as PrismaNotification } from 'prisma/generated/client';

export class NotificationMapper {
	static toDomain(data: PrismaNotification): Notification {
		return Notification.create(
			{
				userId: new UniqueEntityId(data.userId),
				type: data.type,
				data: data.data as JsonValue,
				isRead: data.isRead,
				createdAt: data.createdAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: Notification): PrismaNotification {
		return {
			id: data.id.toString(),
			userId: data.userId.toString(),
			data: data.data as Prisma.JsonObject,
			type: data.type,
			isRead: data.isRead,
			createdAt: data.createdAt,
		};
	}
}
