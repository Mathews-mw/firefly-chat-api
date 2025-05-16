import { prisma } from '../prisma';
import { Prisma } from 'prisma/generated/client';
import { Notification } from '@/domains/notification/models/notification';
import { NotificationMapper } from '../mappers/notification/notification-mapper';
import { NotificationDetailsMapper } from '../mappers/notification/notification-details-mapper';
import {
	INotificationRepository,
	IFindManyByUserQuery,
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

	async delete(notification: Notification) {
		await prisma.notification.delete({
			where: {
				id: notification.id.toString(),
			},
		});
	}

	async findManyByUserId({ page, perPage, userId, search }: IFindManyByUserQuery) {
		const query: Prisma.NotificationFindManyArgs = {
			where: {
				userId,
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
			notifications: notifications.map(NotificationDetailsMapper.toDomain),
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

	async findUnique(id: string) {
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

		return NotificationDetailsMapper.toDomain(notification);
	}
}
