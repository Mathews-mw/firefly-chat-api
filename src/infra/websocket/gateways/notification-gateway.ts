import { container } from 'tsyringe';
import { FastifyInstance } from 'fastify';

import { IClientToServerEvents } from '../notification-types';
import { authMiddleware } from '@/infra/http/middlewares/auth-middleware';
import { NotificationPublisher } from '../publishers/notification-publisher ';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

export async function notificationGateway(app: FastifyInstance) {
	const publisher = container.resolve<NotificationPublisher>(DEPENDENCY_IDENTIFIERS.NOTIFICATION_PUBLISHER);

	app.get('/notification', { websocket: true, preHandler: authMiddleware }, (connection, request) => {
		const { sub: userId } = request.user;

		publisher.registerSocket(userId, connection);

		connection.on('message', async (data) => {
			try {
				const msg = JSON.parse(data.toString()) as { event: keyof IClientToServerEvents; payload: any };
			} catch (error) {
				console.log('Notification WebSocket - Erro ao tentar fazer parse da mensagem: ', error);
				throw error;
			}
		});

		connection.on('close', () => {
			publisher.removeSocket(userId);
		});
	});
}
