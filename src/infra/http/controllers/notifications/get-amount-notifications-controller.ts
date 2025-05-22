import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { GetAmountNotificationsUseCase } from '@/domains/notification/application/features/notifications/use-cases/get-amount-notification-use-case';

export async function getAmountNotificationsController(request: FastifyRequest, reply: FastifyReply) {
	const { sub } = request.user;

	const service = container.resolve(GetAmountNotificationsUseCase);

	const result = await service.execute({ userId: sub });

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send(result.value);
}
