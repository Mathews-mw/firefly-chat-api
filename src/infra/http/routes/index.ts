import { FastifyInstance } from 'fastify';

import { authRoutes } from './auth-routes';
import { chatRoutes } from './chat-routes';
import { usersRoutes } from './users-routes';
import { healthCheckApi } from './health-check-api';
import { friendshipsRoutes } from './friendship-routes';
import { attachmentsRoutes } from './attachments-routes';
import { notificationsRoutes } from './notifications-route';

export async function routes(app: FastifyInstance) {
	app.register(healthCheckApi, { prefix: '/' });

	app.register(authRoutes, { prefix: '/auth' });

	app.register(chatRoutes, { prefix: '/chat' });
	app.register(usersRoutes, { prefix: '/users' });
	app.register(attachmentsRoutes, { prefix: '/attachments' });
	app.register(friendshipsRoutes, { prefix: '/friendships' });
	app.register(notificationsRoutes, { prefix: '/notifications' });
}
