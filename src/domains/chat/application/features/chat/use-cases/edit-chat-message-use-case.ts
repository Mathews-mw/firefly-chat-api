import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { ForbiddenError } from '@/core/errors/forbidden-error';
import { IUserRepository } from '../../users/repositories/user-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { IChatMessageRepository } from '../repositories/chat-message-repository';
import { IReadReceiptRepository } from '../repositories/read-receipt-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { ChatMessageWithAuthor } from '@/domains/chat/models/entities/value-objects/chat-message-with-author';

interface IRequest {
	messageId: string;
	senderId: string;
	content: string;
}

type Response = Outcome<ResourceNotFoundError | ForbiddenError, { chatMessage: ChatMessageWithAuthor }>;

@injectable()
export class EditChatMessageUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.USERS_REPOSITORY) private usersRepository: IUserRepository,
		@inject(DEPENDENCY_IDENTIFIERS.CHAT_MESSAGES_REPOSITORY) private chatMessagesRepository: IChatMessageRepository,
		@inject(DEPENDENCY_IDENTIFIERS.READ_RECEIPTS_REPOSITORY) private readReceiptsRepository: IReadReceiptRepository
	) {}

	async execute({ content, messageId, senderId }: IRequest): Promise<Response> {
		const user = await this.usersRepository.findById(senderId);
		const message = await this.chatMessagesRepository.findById(messageId);
		const readReceipts = await this.readReceiptsRepository.findUnique({ userId: senderId, messageId });

		if (!message) {
			return failure(new ResourceNotFoundError('Message not found', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		if (!user) {
			return failure(new ResourceNotFoundError('User not found', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		if (!message.senderId.equals(user.id)) {
			return failure(new ForbiddenError('You cannot edit a message that does not belong to you', 'FORBIDDEN_ERROR'));
		}

		message.content = content;

		await this.chatMessagesRepository.update(message);

		const response = ChatMessageWithAuthor.create({
			id: message.id,
			roomId: message.roomId,
			senderId: message.senderId,
			content: message.content,
			createdAt: message.createdAt,
			author: user,
			isDeleted: message.isDeleted,
			readReceipts: readReceipts ? [readReceipts] : [],
		});

		return success({ chatMessage: response });
	}
}
