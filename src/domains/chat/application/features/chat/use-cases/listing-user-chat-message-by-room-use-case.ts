import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { ForbiddenError } from '@/core/errors/forbidden-error';
import { IParticipantRepository } from '../repositories/participant-repository';
import { IChatMessageRepository } from '../repositories/chat-message-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { ICursorParams, ICursorResponse } from '@/core/interfaces/paginating-interfaces';
import { ChatMessageWithAuthor } from '@/domains/chat/models/entities/value-objects/chat-message-with-author';

interface IRequest extends ICursorParams {
	userId: string;
	roomId: string;
}

type Response = Outcome<ForbiddenError, { cursor: ICursorResponse; chatMessages: Array<ChatMessageWithAuthor> }>;

@injectable()
export class ListingUserChatMessageByRoomUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.PARTICIPANTS_REPOSITORY) private participantsRepository: IParticipantRepository,
		@inject(DEPENDENCY_IDENTIFIERS.CHAT_MESSAGES_REPOSITORY) private chatMessagesRepository: IChatMessageRepository
	) {}

	async execute({ limit, cursor, skip, userId, roomId }: IRequest): Promise<Response> {
		const isInRoom = await this.participantsRepository.findUnique({
			userId,
			roomId,
		});

		if (!isInRoom) {
			return failure(
				new ForbiddenError('You do not have permission to access this chat room.', 'INSUFFICIENT_PERMISSION_ERROR')
			);
		}

		const { nextCursor, previousCursor, hasMore, chatMessages } = await this.chatMessagesRepository.findManyWithCursor({
			limit,
			cursor,
			skip,
			roomId,
		});

		return success({
			cursor: { hasMore, nextCursor, previousCursor },
			chatMessages,
		});
	}
}
