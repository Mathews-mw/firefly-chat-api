import 'reflect-metadata';
import '@/shared/di/containers/index';
import '@/shared/di/event-buses';

import path from 'node:path';
import fastify from 'fastify';
import { cwd } from 'node:process';
import fastifyJwt from '@fastify/jwt';
import { readFileSync } from 'node:fs';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import fastifyStatic from '@fastify/static';
import fastifySwagger from '@fastify/swagger';
import fastifyWebsocket from '@fastify/websocket';
import fastifyMultipart from '@fastify/multipart';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

import { env } from '@/env';
import { routes } from './http/routes';
import { errorHandler } from './error-handler';
import { chatGateway } from './websocket/gateways/chat-gateway';
import { presenceGateway } from './websocket/gateways/presence-gateway';
import { notificationGateway } from './websocket/gateways/notification-gateway';

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCookie);

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyWebsocket);

app.register(fastifyMultipart, {
	limits: {
		fileSize: 1024 * 1000 * 120, //120mb
	},
});

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'Firefly Chat API',
			description: 'An API from Firefly Chat Services',
			version: `${process.env.npm_package_version}`,
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
	},
	transform: jsonSchemaTransform,
});

app.setErrorHandler(errorHandler);

app.register(fastifySwaggerUi, {
	routePrefix: '/api/docs',
});

app.register(fastifyJwt, {
	secret: {
		private: readFileSync(path.resolve(cwd(), 'jwtRS256.key'), 'utf8'),
		public: readFileSync(path.resolve(cwd(), 'jwtRS256.key.pub'), 'utf8'),
	},
	cookie: {
		cookieName: env.JWT_COOKIE_NAME,
		signed: false,
	},
	sign: {
		expiresIn: '1d',
		algorithm: 'RS256',
	},
});

app.register(fastifyCors, {
	origin: ['http://localhost:3000'],
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
});

app.register(fastifyStatic, {
	root: path.resolve(cwd(), 'tmp'),
	prefix: '/api/public',
});

// Websocket events
app.register(chatGateway, { prefix: '/ws' });
app.register(presenceGateway, { prefix: '/ws' });
app.register(notificationGateway, { prefix: '/ws' });

app.register(routes, { prefix: '/api' });
