import * as WebSocket from 'ws';
import { container } from 'tsyringe';
import { FastifyInstance } from 'fastify';

import { authMiddleware } from '@/infra/http/middlewares/auth-middleware';
import { IClientToServerEvents, IServerToClientEvents } from '@/infra/websocket/chat-types';
import { CreateChatMessageUseCase } from '@/domains/chat/application/features/chat/use-cases/create-chat-message-use-case';
import { MarkMessagesAsReadUseCase } from '@/domains/chat/application/features/chat/use-cases/mark-messages-as-read-use-case';

export async function chatGateway(app: FastifyInstance) {
	// Map roomId → Set de sockets
	const rooms = new Map<string, Set<WebSocket.WebSocket>>();

	const chatService = container.resolve(CreateChatMessageUseCase);
	const markAsReadService = container.resolve(MarkMessagesAsReadUseCase);

	app.get('/chat/members', { websocket: true, preHandler: [authMiddleware] }, (connection, request) => {
		const { sub: userId } = request.user;

		// 1) Registra handlers de mensagem
		connection.on('message', async (data) => {
			try {
				const msg = JSON.parse(data.toString()) as { event: keyof IClientToServerEvents; payload: any };
				console.log('ws msg: ', msg);

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
		function broadcast<K extends keyof IServerToClientEvents>(
			roomId: string,
			event: K,
			payload: IServerToClientEvents[K]
		) {
			const sockets = rooms.get(roomId);

			if (!sockets) return;

			const msg = JSON.stringify({ event, payload });

			for (const socket of sockets) {
				socket.send(msg);
			}
		}

		// Handler genérico de eventos
		async function handleEvent<K extends keyof IClientToServerEvents>(
			event: K,
			payload: IClientToServerEvents[K],
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

				case 'markAsRead': {
					const { roomId, messageIds } = payload as IClientToServerEvents['markAsRead'];

					try {
						await markAsReadService.execute({ roomId, userId, messageIds });

						socket.send(JSON.stringify({ event: 'readConfirmed', payload: { roomId, messageIds } }));

						broadcast(roomId, 'messageRead', {
							roomId,
							userId,
							messageIds,
						});
					} catch (error: any) {
						socket.send(JSON.stringify({ event: 'error', payload: { message: error.message } }));
					} finally {
						break;
					}
				}

				case 'sendMessage': {
					const { roomId, content } = payload as IClientToServerEvents['sendMessage'];

					// 1) persiste no DB via ChatService
					const result = await chatService.execute({ senderId: userId, content, roomId });

					if (result.isFalse()) {
						throw result.value;
					}

					const { chatMessage } = result.value;

					// 2) envia a todos da sala
					broadcast(roomId, 'message', {
						roomId,
						message: {
							id: chatMessage.id.toString(),
							roomId: chatMessage.roomId.toString(),
							senderId: chatMessage.senderId.toString(),
							content: chatMessage.content,
							createdAt: chatMessage.createdAt.toISOString(),
							author: {
								id: chatMessage.author.id.toString(),
								name: chatMessage.author.name,
								avatarUrl: chatMessage.author.avatarUrl,
							},
						},
					});

					break;
				}
			}
		}
	});
}
