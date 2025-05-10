import { FastifyInstance } from 'fastify';

import { authRoutes } from './auth-routes';
import { usersRoutes } from './users-routes';
import { healthCheckApi } from './health-check-api';
import { friendshipsRoutes } from './friendship-routes';
import { chatRoutes } from './chat-routes';

export async function routes(app: FastifyInstance) {
	app.register(healthCheckApi, { prefix: '/' });

	app.register(authRoutes, { prefix: '/auth' });

	app.register(usersRoutes, { prefix: '/users' });
	app.register(friendshipsRoutes, { prefix: '/friendships' });

	app.register(chatRoutes, { prefix: '/chat' });
}
