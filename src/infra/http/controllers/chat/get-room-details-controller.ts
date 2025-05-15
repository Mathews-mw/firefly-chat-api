import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { AttachmentType } from '@/domains/chat/models/entities/attachment';
import { AttachmentPresenter } from '../../presenters/attachments/attachment-presenter';
import { ParticipantWithUserPresenter } from '../../presenters/chat/participant-with-user-presenter';
import { GetRoomDetailsParams, GetRoomDetailsQuery } from '../../schemas/chat/get-room-details-schema';
import { GetRoomDetailsUseCase } from '@/domains/chat/application/features/chat/use-cases/get-room-details-use-case';

export async function getRoomDetailsController(request: FastifyRequest, reply: FastifyReply) {
	const { roomId } = request.params as GetRoomDetailsParams;
	const { is_private } = request.query as GetRoomDetailsQuery;

	const service = container.resolve(GetRoomDetailsUseCase);

	const result = await service.execute({
		roomId,
		isPrivate: is_private,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	const { room } = result.value;

	const attachmentsGroupedByType = room.attachments.reduce<Record<AttachmentType, AttachmentPresenter[]>>(
		(acc, attachment) => {
			if (!acc[attachment.type]) {
				acc[attachment.type] = [];
			}
			acc[attachment.type].push(AttachmentPresenter.toHTTP(attachment));
			return acc;
		},
		{} as Record<AttachmentType, AttachmentPresenter[]>
	);

	const response = {
		id: room.id.toString(),
		type: room.type,
		created_at: room.createdAt,
		participants: room.participants.map(ParticipantWithUserPresenter.toHTTP),
		attachments: attachmentsGroupedByType,
	};

	return reply.status(201).send(response);
}
