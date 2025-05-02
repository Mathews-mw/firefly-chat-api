import { FastifyRequest } from 'fastify';

import { Role } from '@/core/auth/roles';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';

interface IJwtPayload {
	sub: string;
	role: Role;
	iat: number;
	exp: number;
}

export async function authMiddleware(request: FastifyRequest) {
	try {
		const jwtPayload = await request.jwtVerify<IJwtPayload>();

		const { sub, role } = jwtPayload;

		request.user = {
			sub,
			role,
		};
	} catch (error) {
		if (error instanceof Error && 'code' in error) {
			if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
				throw new UnauthorizedError('Expired token', 'AUTH_EXPIRED_TOKEN_ERROR');
			}
		}

		if (error instanceof Error && 'code' in error) {
			if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_COOKIE') {
				throw new UnauthorizedError(
					'Authorization token not found in cookies',
					'AUTH_NO_AUTHORIZATION_IN_COOKIE_ERROR'
				);
			}
		}

		throw new UnauthorizedError('Invalid auth token', 'AUTH_INVALID_TOKEN_ERROR');
	}
}
