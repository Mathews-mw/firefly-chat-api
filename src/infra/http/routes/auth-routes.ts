import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { refreshTokenSchema } from '../schemas/auth/refresh-token-schema';
import { authenticateUserSchema } from '../schemas/auth/authenticate-user-schema';
import { refreshTokenController } from '../controllers/auth/refresh-token-controller';
import { authenticateWithCredentialsController } from '../controllers/auth/authenticate-with-credentials-controller';
import { authMiddleware } from '../middlewares/auth-middleware';

export async function authRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/signin/credentials',
		{
			schema: authenticateUserSchema,
		},
		authenticateWithCredentialsController
	);

	app.withTypeProvider<ZodTypeProvider>().patch(
		'/refresh-token',

		{
			onRequest: [authMiddleware],
			schema: refreshTokenSchema,
		},
		refreshTokenController
	);
}
