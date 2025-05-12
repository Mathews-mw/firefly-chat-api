import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { ForbiddenError } from '@/core/errors/forbidden-error';
import { IUserRepository } from '../../users/repositories/user-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { IChatMessageRepository } from '../repositories/chat-message-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	messageId: string;
	senderId: string;
}

type Response = Outcome<ResourceNotFoundError | ForbiddenError, null>;

@injectable()
export class DeleteChatMessageUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.USERS_REPOSITORY) private usersRepository: IUserRepository,
		@inject(DEPENDENCY_IDENTIFIERS.CHAT_MESSAGES_REPOSITORY) private chatMessagesRepository: IChatMessageRepository
	) {}

	async execute({ messageId, senderId }: IRequest): Promise<Response> {
		const user = await this.usersRepository.findById(senderId);
		const message = await this.chatMessagesRepository.findById(messageId);

		if (!message) {
			return failure(new ResourceNotFoundError('Message not found', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		if (!user) {
			return failure(new ResourceNotFoundError('User not found', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		if (!message.senderId.equals(user.id)) {
			return failure(new ForbiddenError('You cannot delete a message that does not belong to you', 'FORBIDDEN_ERROR'));
		}

		message.isDeleted = true;

		await this.chatMessagesRepository.update(message);

		return success(null);
	}
}
