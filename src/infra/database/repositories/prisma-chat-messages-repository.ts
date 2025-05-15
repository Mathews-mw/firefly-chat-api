import { prisma } from '../prisma';
import { Prisma } from 'prisma/generated/client';
import { ChatMessageMapper } from '../mappers/chat/chat-message-mapper';
import { ChatMessage } from '@/domains/chat/models/entities/chat-message';
import { ChatMessageDetailsMapper } from '../mappers/chat/chat-message-details-mapper';
import { ChatMessageWithAuthorMapper } from '../mappers/chat/chat-message-with-author-mapper';
import {
	IChatMessageQuerySearchWithCursor,
	IChatMessageRepository,
} from '@/domains/chat/application/features/chat/repositories/chat-message-repository';

export class PrismaChatMessagesRepository implements IChatMessageRepository {
	async create(chatMessage: ChatMessage) {
		const data = ChatMessageMapper.toPrisma(chatMessage);

		await prisma.chatMessage.create({
			data,
		});

		return chatMessage;
	}

	async update(chatMessage: ChatMessage) {
		const data = ChatMessageMapper.toPrisma(chatMessage);

		await prisma.chatMessage.update({
			data,
			where: {
				id: data.id,
			},
		});

		return chatMessage;
	}

	async delete(chatMessage: ChatMessage) {
		await prisma.chatMessage.delete({
			where: {
				id: chatMessage.id.toString(),
			},
		});
	}

	async findMany() {
		const chatMessage = await prisma.chatMessage.findMany();

		return chatMessage.map(ChatMessageMapper.toDomain);
	}

	async findManyWithCursor({ limit, cursor, skip, roomId }: IChatMessageQuerySearchWithCursor) {
		const query: Prisma.ChatMessageFindManyArgs = {
			where: {
				roomId,
			},
		};

		const chatMessages = await prisma.chatMessage.findMany({
			where: query.where,
			include: {
				author: true,
				readReceipts: true,
				attachments: true,
			},
			skip,
			take: limit + 1,
			cursor: cursor
				? {
						id: cursor,
					}
				: undefined,
			orderBy: {
				createdAt: 'desc',
			},
		});

		let nextCursor: string | undefined;
		let previousCursor: string | undefined;
		let hasMore = true;

		if (chatMessages.length > limit) {
			hasMore = true;
			previousCursor = chatMessages[0].id;

			const nextItem = chatMessages.pop();
			nextCursor = nextItem?.id;
		} else {
			hasMore = false;
		}

		return {
			nextCursor,
			previousCursor,
			hasMore,
			chatMessages: chatMessages.map(ChatMessageWithAuthorMapper.toDomain),
		};
	}

	async findById(id: string) {
		const chatMessage = await prisma.chatMessage.findUnique({
			where: {
				id,
			},
		});

		if (!chatMessage) {
			return null;
		}

		return ChatMessageMapper.toDomain(chatMessage);
	}

	async findDetails(id: string) {
		const chatMessage = await prisma.chatMessage.findUnique({
			where: {
				id,
			},
			include: {
				author: true,
				room: true,
				readReceipts: true,
				attachments: true,
			},
		});

		if (!chatMessage) {
			return null;
		}

		return ChatMessageDetailsMapper.toDomain(chatMessage);
	}
}
