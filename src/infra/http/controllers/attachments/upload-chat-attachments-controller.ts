import fs from 'node:fs';
import path from 'node:path';
import { cwd } from 'node:process';
import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { Attachment } from '@/domains/chat/models/entities/attachment';
import { AttachmentPresenter } from '../../presenters/attachments/attachment-presenter';
import { UploadChatAttachmentUseCase } from '@/domains/chat/application/features/attachments/use-cases/upload-chat-attachment-use-case';

export async function uploadChatAttachmentsController(request: FastifyRequest, reply: FastifyReply) {
	const parts = request.files();

	const service = container.resolve(UploadChatAttachmentUseCase);

	const attachments: Array<Attachment> = [];

	for await (const part of parts) {
		const bufferFile = await part.toBuffer();
		const uniqueFilename = `${Date.now()}_${part.filename}`;

		const filePath = path.resolve(cwd(), 'tmp', 'chat-uploads', uniqueFilename);

		try {
			await fs.writeFileSync(filePath, bufferFile);
		} catch (error) {
			console.log('Upload file error: ', error);
			throw error;
		}

		const result = await service.execute({
			fileName: uniqueFilename,
			fileType: part.mimetype,
		});

		if (result.isFalse()) {
			throw result.value;
		}

		const { attachment } = result.value;

		attachments.push(attachment);
	}

	return reply
		.status(200)
		.send({ message: 'Attachment upload successful', attachments: attachments.map(AttachmentPresenter.toHTTP) });
}
