import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { DeleteNotificationParams } from '../../schemas/notification/delete-notification.schema';
import { DeleteNotificationUseCase } from '@/domains/notification/application/features/notifications/use-cases/delete-notification-use-case';

export async function deleteNotificationController(request: FastifyRequest, reply: FastifyReply) {
	const { notificationId } = request.params as DeleteNotificationParams;

	const { sub } = request.user;

	const service = container.resolve(DeleteNotificationUseCase);

	const result = await service.execute({
		userId: sub,
		notificationId,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send({ message: 'Notification successfully deleted' });
}
