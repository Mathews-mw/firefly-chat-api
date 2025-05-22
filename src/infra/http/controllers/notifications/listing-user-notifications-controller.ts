import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { PaginationPresenter } from '../../presenters/pagination-presenter';
import { ListingUserNotificationsQuery } from '../../schemas/notification/listing-user-notifications-schema';
import { NotificationDetailsPresenter } from '../../presenters/notifications/notification-details-presenter';
import { ListingUserNotificationsUseCase } from '@/domains/notification/application/features/notifications/use-cases/listing-user-notifications-use-case';

export async function listingUserNotificationsController(request: FastifyRequest, reply: FastifyReply) {
	const { page, per_page } = request.query as ListingUserNotificationsQuery;
	const { sub } = request.user;

	const service = container.resolve(ListingUserNotificationsUseCase);

	const result = await service.execute({
		userId: sub,
		page,
		perPage: per_page,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	const response = {
		pagination: PaginationPresenter.paginationModeToHTTP(result.value.pagination),
		notifications: result.value.notifications.map(NotificationDetailsPresenter.toHTTP),
	};

	return reply.status(200).send(response);
}
