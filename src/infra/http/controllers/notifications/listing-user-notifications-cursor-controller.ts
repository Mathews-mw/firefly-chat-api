import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { PaginationPresenter } from '../../presenters/pagination-presenter';
import { NotificationDetailsPresenter } from '../../presenters/notifications/notification-details-presenter';
import { ListingUserNotificationsCursorUseCase } from '@/domains/notification/application/features/notifications/use-cases/listing-user-notifications-cursor-use-case';
import {
	ListingUserNotificationsCursorQuery,
	ListingUserNotificationsCursorResponse,
} from '../../schemas/notification/listing-user-notifications-cursor-schema';

export async function listingUserNotificationsCursorController(request: FastifyRequest, reply: FastifyReply) {
	const { limit, cursor, skip, type, is_read } = request.query as ListingUserNotificationsCursorQuery;
	const { sub } = request.user;

	const service = container.resolve(ListingUserNotificationsCursorUseCase);

	const result = await service.execute({
		limit,
		cursor,
		skip,
		userId: sub,
		type,
		isRead: is_read,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	const response: ListingUserNotificationsCursorResponse = {
		cursor: PaginationPresenter.cursorModeToHTTP(result.value.cursor),
		notifications: result.value.notifications.map(NotificationDetailsPresenter.toHTTP),
	};

	return reply.status(200).send(response);
}
