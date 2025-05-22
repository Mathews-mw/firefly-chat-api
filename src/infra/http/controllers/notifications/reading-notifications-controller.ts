import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { ReadingNotificationsRequest } from '../../schemas/notification/reading-notifications-schema';
import { ReadingNotificationsUseCase } from '@/domains/notification/application/features/notifications/use-cases/reading-notifications-use-case';

export async function readingNotificationsController(request: FastifyRequest, reply: FastifyReply) {
	const { notification_ids } = request.body as ReadingNotificationsRequest;

	const { sub } = request.user;

	const service = container.resolve(ReadingNotificationsUseCase);

	const result = await service.execute({
		userId: sub,
		notificationIds: notification_ids,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send({ message: 'Notifications successfully read' });
}
