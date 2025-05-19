import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Json } from '@/core/types/json';
import { Notification } from '@/domains/notification/models/notification';
import { Prisma, Notification as PrismaNotification } from 'prisma/generated/client';

export class NotificationMapper {
	static toDomain(data: PrismaNotification): Notification {
		return Notification.create(
			{
				recipientId: new UniqueEntityId(data.recipientId),
				type: data.type,
				data: data.data as Json,
				isRead: data.isRead,
				createdAt: data.createdAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: Notification): PrismaNotification {
		return {
			id: data.id.toString(),
			recipientId: data.recipientId.toString(),
			type: data.type,
			data: data.data as Prisma.JsonObject,
			isRead: data.isRead,
			createdAt: data.createdAt,
		};
	}
}
