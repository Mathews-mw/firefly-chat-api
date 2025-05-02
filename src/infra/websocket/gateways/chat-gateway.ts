import {
	ChatMessage,
	ClientToServerEvents,
	ServerToClientEvents,
} from '@/domains/chat/application/features/chat/chat-types';
import { ChatUseCase } from '@/domains/chat/application/features/chat/chat-use-case';
import { authMiddleware } from '@/infra/http/middlewares/auth-middleware';
import { FastifyInstance } from 'fastify';
import * as WebSocket from 'ws';

export async function chatGateway(app: FastifyInstance) {
	// Map roomId → Set de sockets
	const rooms = new Map<string, Set<WebSocket.WebSocket>>();

	app.get('/chat/members', { websocket: true, preHandler: [authMiddleware] }, (connection, request) => {
		const { sub: userId, role } = request.user;

		// 1) Registra handlers de mensagem
		connection.on('message', async (data) => {
			try {
				const msg = JSON.parse(data.toString()) as { event: keyof ClientToServerEvents; payload: any };
				console.log('msg: ', msg);

				await handleEvent(msg.event, msg.payload, connection, userId);
			} catch (error) {
				console.log('WebSocket - Erro ao tentar registra handlers de mensagem: ', error);
				throw error;
			}
		});

		// 2) Limpeza ao desconectar
		connection.on('close', () => {
			for (const [roomId, sockets] of rooms) {
				sockets.delete(connection);

				if (sockets.delete(connection)) {
					broadcast(roomId, 'userLeft', { roomId, userId });
				}
			}
		});

		// Função de broadcast
		function broadcast<K extends keyof ServerToClientEvents>(
			roomId: string,
			event: K,
			payload: ServerToClientEvents[K]
		) {
			const sockets = rooms.get(roomId);

			if (!sockets) return;

			const msg = JSON.stringify({ event, payload });

			for (const socket of sockets) {
				socket.send(msg);
			}
		}

		// Handler genérico de eventos
		async function handleEvent(
			event: keyof ClientToServerEvents,
			payload: any,
			socket: WebSocket.WebSocket,
			userId: string
		) {
			switch (event) {
				case 'joinRoom': {
					const { roomId } = payload;

					if (!rooms.has(roomId)) {
						rooms.set(roomId, new Set());
					}

					rooms.get(roomId)!.add(socket);

					broadcast(roomId, 'userJoined', { roomId, userId });

					break;
				}
				case 'leaveRoom': {
					const { roomId } = payload;

					rooms.get(roomId)?.delete(socket);

					broadcast(roomId, 'userLeft', { roomId, userId });

					break;
				}
				case 'sendMessage': {
					const { roomId, content } = payload;

					// 1) persiste no DB via ChatService
					const chatService = new ChatUseCase();
					const message: ChatMessage = await chatService.execute(roomId, userId, content);

					// 2) envia a todos da sala
					broadcast(roomId, 'message', { roomId, message });

					break;
				}
			}
		}
	});
}
