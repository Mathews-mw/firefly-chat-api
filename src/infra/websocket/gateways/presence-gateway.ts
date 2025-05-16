import * as WebSocket from 'ws';
import { container } from 'tsyringe';
import { FastifyInstance } from 'fastify';

import { authMiddleware } from '@/infra/http/middlewares/auth-middleware';
import { ListingUserFriendsUseCase } from '@/domains/chat/application/features/friendships/use-cases/listing-user-friends-use-case';

type SocketMeta = { userId: string };

export async function presenceGateway(app: FastifyInstance) {
	const connectionCounts = new Map<string, number>(); // mapa userId → número de conexões ativas |  <userId, active connections amount>;
	const activeSockets = new Map<WebSocket.WebSocket, SocketMeta>(); // Mapa de sockets ativos

	const service = container.resolve(ListingUserFriendsUseCase);

	app.get('/presence', { websocket: true, preHandler: [authMiddleware] }, (connection, request) => {
		const { sub: userId } = request.user;

		// 1) Register
		activeSockets.set(connection, { userId });
		const prevCount = connectionCounts.get(userId) ?? 0;
		connectionCounts.set(userId, prevCount + 1);

		// 2) Se foi 0→1, usuário ficou online
		if (prevCount === 0) {
			broadcastPresence(userId, true);
		}

		connection.on('close', () => {
			activeSockets.delete(connection);

			const newCount = (connectionCounts.get(userId) ?? 1) - 1;

			if (newCount <= 0) {
				connectionCounts.delete(userId);
				broadcastPresence(userId, false);
			} else {
				connectionCounts.set(userId, newCount);
			}
		});
	});

	// helper para broadcast de presença
	async function broadcastPresence(userId: string, isOnline: boolean) {
		const result = await service.execute({ userId, page: 1, perPage: 9999 });

		if (result.isFalse()) {
			throw Error();
		}

		const { friendships } = result.value;

		const friendSet = new Set(friendships.map((f) => f.friendId.toString()));

		// Para cada socket ativo cujo userId esteja em friendSet, envie o evento
		for (const [socket, { userId: otherUserId }] of activeSockets) {
			if (otherUserId === userId) continue;

			if (friendSet.has(otherUserId)) {
				socket.send(
					JSON.stringify({
						event: 'presence',
						payload: { userId, isOnline },
					})
				);
			}
		}
	}
}
