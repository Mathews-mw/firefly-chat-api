import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { GetNotificationParams } from '../../schemas/notification/get-notification-schema';
import { NotificationDetailsPresenter } from '../../presenters/notifications/notification-details-presenter';
import { GetNotificationUseCase } from '@/domains/notification/application/features/notifications/use-cases/get-notification-use-case';

export async function getNotificationController(request: FastifyRequest, reply: FastifyReply) {
	const { notificationId } = request.params as GetNotificationParams;

	const service = container.resolve(GetNotificationUseCase);

	const result = await service.execute({
		notificationId,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send(NotificationDetailsPresenter.toHTTP(result.value.notification));
}
