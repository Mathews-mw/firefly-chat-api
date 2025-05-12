import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { IRoomRepository } from '../repositories/room-repository';
import { ChatMessage } from '@/domains/chat/models/entities/chat-message';
import { IUserRepository } from '../../users/repositories/user-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { IChatMessageRepository } from '../repositories/chat-message-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { ChatMessageWithAuthor } from '@/domains/chat/models/entities/value-objects/chat-message-with-author';

interface IRequest {
	roomId: string;
	senderId: string;
	content: string;
}

type Response = Outcome<ResourceNotFoundError, { chatMessage: ChatMessageWithAuthor }>;

@injectable()
export class CreateChatMessageUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.ROOMS_REPOSITORY) private roomsRepository: IRoomRepository,
		@inject(DEPENDENCY_IDENTIFIERS.USERS_REPOSITORY) private usersRepository: IUserRepository,
		@inject(DEPENDENCY_IDENTIFIERS.CHAT_MESSAGES_REPOSITORY) private chatMessagesRepository: IChatMessageRepository
	) {}

	async execute({ content, roomId, senderId }: IRequest): Promise<Response> {
		const room = await this.roomsRepository.findById(roomId);
		const user = await this.usersRepository.findById(senderId);

		if (!user) {
			return failure(new ResourceNotFoundError('User not found', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		if (!room) {
			return failure(new ResourceNotFoundError('Room not found', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		const newChatMessage = ChatMessage.create({
			roomId: room.id,
			senderId: user.id,
			content,
		});

		await this.chatMessagesRepository.create(newChatMessage);

		const response = ChatMessageWithAuthor.create({
			id: newChatMessage.id,
			roomId: newChatMessage.roomId,
			senderId: newChatMessage.senderId,
			content: newChatMessage.content,
			createdAt: newChatMessage.createdAt,
			author: user,
			isDeleted: false,
			readReceipts: [],
		});

		return success({ chatMessage: response });
	}
}
