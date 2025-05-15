import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { IAttachmentRepository } from '../repositories/attachment-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { Attachment } from '@/domains/chat/models/entities/attachment';

interface IRequest {
	id: string;
	title?: string;
	url?: string;
	roomId?: string;
	messageId?: string;
}

type Response = Outcome<ResourceNotFoundError, { attachment: Attachment }>;

@injectable()
export class UpdateAttachmentUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.ATTACHMENTS_REPOSITORY)
		private attachmentsRepository: IAttachmentRepository
	) {}

	async execute({ id, title, url, roomId, messageId }: IRequest): Promise<Response> {
		const attachment = await this.attachmentsRepository.findById(id);

		if (!attachment) {
			return failure(new ResourceNotFoundError('Attachment not found', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		attachment.title = title ?? attachment.title;
		attachment.url = url ?? attachment.url;
		attachment.roomId = roomId ? new UniqueEntityId(roomId) : attachment.roomId;
		attachment.messageId = messageId ? new UniqueEntityId(messageId) : attachment.messageId;

		await this.attachmentsRepository.update(attachment);

		return success({ attachment });
	}
}
