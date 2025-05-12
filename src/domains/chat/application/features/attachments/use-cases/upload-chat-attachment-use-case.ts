import { inject, injectable } from 'tsyringe';

import { Outcome, success } from '@/core/outcome';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Attachment } from '@/domains/chat/models/entities/attachment';
import { IAttachmentRepository } from '../repositories/attachment-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	fileName: string;
	roomId?: string;
	messageId?: string;
}

type Response = Outcome<null, { attachment: Attachment }>;

@injectable()
export class UploadChatAttachmentUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.ATTACHMENTS_REPOSITORY)
		private attachmentsRepository: IAttachmentRepository
	) {}

	async execute({ fileName, roomId, messageId }: IRequest): Promise<Response> {
		const newAttachment = Attachment.create({
			title: fileName,
			url: `http://localhost:3737/api/public/chat-uploads/${fileName}`,
			roomId: roomId ? new UniqueEntityId(roomId) : null,
			messageId: messageId ? new UniqueEntityId(messageId) : null,
		});

		await this.attachmentsRepository.create(newAttachment);

		return success({ attachment: newAttachment });
	}
}
