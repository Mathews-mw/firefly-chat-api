import { prisma } from '../prisma';
import { Json } from '@/core/types/json';
import { Prisma } from 'prisma/generated/client';
import { Notification } from '@/domains/notification/models/notification';
import { NotificationMapper } from '../mappers/notification/notification-mapper';
import { INotificationTypeKey } from '@/domains/notification/models/notification-type';
import { NotificationTypeMapper } from '../mappers/notification/notification-type-mapper';
import { NotificationDetailsMapper } from '../mappers/notification/notification-details-mapper';
import { NotificationDetails } from '@/domains/notification/models/value-objects/notification-details';
import {
	INotificationRepository,
	IFindManyByUserQuery,
	INotificationCursorParams,
	AmountNotificationsResponse,
} from '@/domains/notification/application/features/notifications/repositories/notification-repository';

export class PrismaNotificationsRepository implements INotificationRepository {
	async create(notification: Notification) {
		const data = NotificationMapper.toPrisma(notification) as Prisma.NotificationUncheckedCreateInput;

		await prisma.notification.create({
			data,
		});

		return notification;
	}

	async update(notification: Notification) {
		const data = NotificationMapper.toPrisma(notification) as Prisma.NotificationUncheckedUpdateInput;

		await prisma.notification.update({
			data,
			where: {
				id: notification.id.toString(),
			},
		});

		return notification;
	}

	async delete(id: string) {
		await prisma.notification.delete({
			where: {
				id,
			},
		});
	}

	async findManyByUserId<T extends Json = Json>({ page, perPage, userId, isRead }: IFindManyByUserQuery) {
		const query: Prisma.NotificationFindManyArgs = {
			where: {
				recipientId: userId,
				isRead,
			},
		};

		const isPerPageNumber = typeof perPage === 'number';

		const [notifications, count] = await prisma.$transaction([
			prisma.notification.findMany({
				where: query.where,
				include: {
					notificationType: true,
				},
				orderBy: {
					createdAt: 'desc',
				},
				take: isPerPageNumber ? perPage : undefined,
				skip: isPerPageNumber ? (page - 1) * perPage : undefined,
			}),
			prisma.notification.count({
				where: query.where,
			}),
		]);

		let _perPage = isPerPageNumber ? perPage : 10;

		if (perPage === 'all') {
			_perPage = count;
		}

		const totalPages = Math.ceil(count / _perPage);

		const pagination = {
			page,
			perPage: _perPage,
			totalPages,
			totalOccurrences: count,
		};

		return {
			pagination,
			notifications: notifications.map(NotificationDetailsMapper.toDomain) as NotificationDetails<T>[],
		};
	}

	async findManyCursor<T extends Json = Json>({
		limit,
		cursor,
		skip,
		userId,
		type,
		isRead,
	}: INotificationCursorParams) {
		const query: Prisma.NotificationFindManyArgs = {
			where: {
				recipientId: userId,
				type,
				isRead,
			},
		};

		const notifications = await prisma.notification.findMany({
			where: query.where,
			include: {
				notificationType: true,
			},
			skip,
			take: limit + 1,
			cursor: cursor
				? {
						id: cursor,
					}
				: undefined,
			orderBy: {
				createdAt: 'desc',
			},
		});

		let nextCursor: string | undefined;
		let previousCursor: string | undefined;
		let hasMore = true;

		if (notifications.length > limit) {
			hasMore = true;
			previousCursor = notifications[0].id;

			const nextItem = notifications.pop();
			nextCursor = nextItem?.id;
		} else {
			hasMore = false;
		}

		return {
			cursor: {
				nextCursor,
				previousCursor,
				hasMore,
			},
			notifications: notifications.map(NotificationDetailsMapper.toDomain) as NotificationDetails<T>[],
		};
	}

	async findById(id: string) {
		const notification = await prisma.notification.findUnique({
			where: {
				id,
			},
		});

		if (!notification) {
			return null;
		}

		return NotificationMapper.toDomain(notification);
	}

	async findUnique<T extends Json = Json>(id: string) {
		const notification = await prisma.notification.findUnique({
			where: {
				id,
			},
			include: {
				notificationType: true,
			},
		});

		if (!notification) {
			return null;
		}

		return NotificationDetailsMapper.toDomain(notification) as NotificationDetails<T>;
	}

	async notificationsAmount(userId: string): Promise<AmountNotificationsResponse> {
		const amount = await prisma.notification.count({
			where: {
				recipientId: userId,
			},
		});

		const group = await prisma.notification.groupBy({
			by: 'isRead',
			_count: {
				isRead: true,
			},
			where: {
				recipientId: userId,
			},
			orderBy: undefined,
		});

		const [unread, read] = group;

		return {
			total: amount,
			read: group.length ? read._count.isRead : 0,
			unread: group.length ? unread._count.isRead : 0,
		};
	}

	async getNotificationType(type: INotificationTypeKey) {
		const result = await prisma.notificationType.findUnique({
			where: {
				key: type,
			},
		});

		if (!result) {
			return null;
		}

		return NotificationTypeMapper.toDomain(result);
	}
}
