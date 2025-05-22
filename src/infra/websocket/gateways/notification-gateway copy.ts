import * as WebSocket from 'ws';
import { FastifyInstance } from 'fastify';

import { authMiddleware } from '@/infra/http/middlewares/auth-middleware';
import { NotificationDetails } from '@/domains/notification/models/value-objects/notification-details';
import { IClientToServerEvents, IServerToClientEvents } from '../notification-types';
import { container } from 'tsyringe';
import { NotificationPublisher } from '../publishers/notification-publisher ';

export async function notificationGateway(app: FastifyInstance) {
	// const activeSockets = new Map<string, WebSocket.WebSocket>();

	const publisher = container.resolve(NotificationPublisher);

	app.get('/notification', { websocket: true, preHandler: authMiddleware }, (connection, request) => {
		const { sub: userId } = request.user;

		// activeSockets.set(userId, connection);
		publisher.registerSocket(userId, connection);

		connection.on('message', async (data) => {
			try {
				const msg = JSON.parse(data.toString()) as { event: keyof IClientToServerEvents; payload: any };
				console.log('ws notification msg: ', msg);

				await handleEvent(msg.event, msg.payload, connection, userId);
			} catch (error) {
				console.log('Notification WebSocket - Erro ao tentar fazer parse da mensagem: ', error);
				throw error;
			}
		});

		connection.on('close', () => {
			// activeSockets.delete(userId);
			publisher.removeSocket(userId);
		});
	});

	async function broadcastNotification<K extends keyof IServerToClientEvents>(
		userId: string,
		event: K,
		payload: IServerToClientEvents[K]
	) {
		const socket = activeSockets.get(userId);

		if (!socket) return;

		const msg = JSON.stringify({ event, payload });

		for (const [meta, socket] of activeSockets) {
			if (meta === userId) {
				socket.send(msg);
			}
		}
	}

	async function handleEvent<K extends keyof IClientToServerEvents>(
		event: K,
		payload: IClientToServerEvents[K],
		socket: WebSocket.WebSocket,
		userId: string
	) {
		switch (event) {
			case 'invitation':
				const { recipientId } = payload as IClientToServerEvents['invitation'];

				console.log('ws recipientId: ', recipientId);

				broadcastNotification(userId, 'newNotification', { notificationId: '1' });
				break;
		}
	}
}
