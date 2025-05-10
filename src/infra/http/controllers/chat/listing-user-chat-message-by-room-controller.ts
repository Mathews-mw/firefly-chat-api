import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { PaginationPresenter } from '../../presenters/pagination-presenter';
import { ChatMessageWithAuthorPresenter } from '../../presenters/chat/chat-message-with-author-presenter';
import { ListingUserChatMessageByRoomUseCase } from '@/domains/chat/application/features/chat/use-cases/listing-user-chat-message-by-room-use-case';
import {
	ListingUserChatMessageByRoomParams,
	ListingUserChatMessageByRoomQuery,
	ListingUserChatMessageByRoomResponse,
} from '../../schemas/chat/listing-user-chat-message-by-room-schema';

export async function listingUserChatMessageByRoomController(request: FastifyRequest, reply: FastifyReply) {
	const { roomId } = request.params as ListingUserChatMessageByRoomParams;
	const { limit, cursor, skip } = request.query as ListingUserChatMessageByRoomQuery;
	const { sub } = request.user;

	const service = container.resolve(ListingUserChatMessageByRoomUseCase);

	const result = await service.execute({
		limit,
		cursor,
		skip,
		roomId,
		userId: sub,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	const response: ListingUserChatMessageByRoomResponse = {
		cursor: PaginationPresenter.cursorModeToHTTP(result.value.cursor),
		chat_messages: result.value.chatMessages.map(ChatMessageWithAuthorPresenter.toHTTP),
	};

	return reply.status(200).send(response);
}
