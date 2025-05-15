import * as WebSocket from 'ws';
import { container } from 'tsyringe';
import { FastifyInstance } from 'fastify';

import { authMiddleware } from '@/infra/http/middlewares/auth-middleware';
import { IClientToServerEvents, IServerToClientEvents } from '@/infra/websocket/chat-types';
import { EditChatMessageUseCase } from '@/domains/chat/application/features/chat/use-cases/edit-chat-message-use-case';
import { CreateChatMessageUseCase } from '@/domains/chat/application/features/chat/use-cases/create-chat-message-use-case';
import { DeleteChatMessageUseCase } from '@/domains/chat/application/features/chat/use-cases/delete-chat-message-use-case';
import { MarkMessagesAsReadUseCase } from '@/domains/chat/application/features/chat/use-cases/mark-messages-as-read-use-case';
import { UpdateAttachmentUseCase } from '@/domains/chat/application/features/attachments/use-cases/update-attachment-use-case';
import { Attachment } from '@/domains/chat/models/entities/attachment';

export async function chatGateway(app: FastifyInstance) {
	// Map roomId → Set de sockets
	const rooms = new Map<string, Set<WebSocket.WebSocket>>();

	const chatService = container.resolve(CreateChatMessageUseCase);
	const editChatService = container.resolve(EditChatMessageUseCase);
	const markAsReadService = container.resolve(MarkMessagesAsReadUseCase);
	const deleteMessageService = container.resolve(DeleteChatMessageUseCase);
	const updateAttachmentService = container.resolve(UpdateAttachmentUseCase);

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
					console.log('deve registrar leitura das msg: ', messageIds);

					try {
						await markAsReadService.execute({ roomId, userId, messageIds });

						// confirmação para quem marcou a leitura da mensagem
						socket.send(JSON.stringify({ event: 'readConfirmed', payload: { roomId, messageIds } }));

						// notificar todos na sala (inclusive quem leu)
						broadcast(roomId, 'messageRead', {
							roomId,
							readerId: userId,
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
							isDeleted: false,
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

				case 'sendAttachmentMessage': {
					const { roomId, attachmentIds } = payload as IClientToServerEvents['sendAttachmentMessage'];
					console.log('attachmentIds: ', attachmentIds);

					// 1) persiste no DB via ChatService
					const messageResult = await chatService.execute({ senderId: userId, content: 'ATTACHMENT_MESSAGE', roomId });

					if (messageResult.isFalse()) {
						throw messageResult.value;
					}

					const { chatMessage } = messageResult.value;

					const attachments: Array<Attachment> = [];

					for await (const attachmentId of attachmentIds) {
						const result = await updateAttachmentService.execute({
							id: attachmentId,
							roomId,
							messageId: chatMessage.id.toString(),
						});

						if (result.isFalse()) {
							throw messageResult.value;
						}

						attachments.push(result.value.attachment);
					}

					// 2) envia a todos da sala
					broadcast(roomId, 'message', {
						roomId,
						message: {
							id: chatMessage.id.toString(),
							roomId: chatMessage.roomId.toString(),
							senderId: chatMessage.senderId.toString(),
							content: chatMessage.content,
							isDeleted: false,
							createdAt: chatMessage.createdAt.toISOString(),
							author: {
								id: chatMessage.author.id.toString(),
								name: chatMessage.author.name,
								avatarUrl: chatMessage.author.avatarUrl,
							},
							attachments: attachments.map((attachment) => {
								return {
									id: attachment.id.toString(),
									title: attachment.title,
									url: attachment.url,
									type: attachment.type,
								};
							}),
						},
					});

					break;
				}

				case 'editMessage': {
					const { roomId, messageId, content } = payload as IClientToServerEvents['editMessage'];

					const result = await editChatService.execute({ senderId: userId, messageId, content });

					if (result.isFalse()) {
						throw result.value;
					}

					const { chatMessage } = result.value;

					broadcast(roomId, 'messageEdited', {
						roomId,
						message: {
							id: chatMessage.id.toString(),
							roomId: chatMessage.roomId.toString(),
							senderId: chatMessage.senderId.toString(),
							content: chatMessage.content,
							isDeleted: chatMessage.isDeleted,
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

				case 'deleteMessage': {
					const { roomId, messageId } = payload as IClientToServerEvents['deleteMessage'];

					const result = await deleteMessageService.execute({ senderId: userId, messageId });

					if (result.isFalse()) {
						throw result.value;
					}

					broadcast(roomId, 'messageDeleted', { roomId, messageId });
					break;
				}
			}
		}
	});
}
