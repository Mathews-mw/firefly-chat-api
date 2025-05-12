import { prisma } from '../prisma';
import { Attachment } from '@/domains/chat/models/entities/attachment';
import { AttachmentMapper } from '../mappers/attachment/attachment-mapper';
import { IAttachmentRepository } from '@/domains/chat/application/features/attachments/repositories/attachment-repository';

export class PrismaAttachmentsRepository implements IAttachmentRepository {
	async create(attachment: Attachment): Promise<Attachment> {
		const data = AttachmentMapper.toDatabase(attachment);

		await prisma.attachment.create({ data });

		return attachment;
	}

	async update(attachment: Attachment): Promise<Attachment> {
		const data = AttachmentMapper.toDatabase(attachment);

		await prisma.attachment.update({
			data,
			where: {
				id: attachment.id.toString(),
			},
		});

		return attachment;
	}

	async delete(attachment: Attachment): Promise<void> {
		await prisma.attachment.delete({
			where: {
				id: attachment.id.toString(),
			},
		});
	}

	async findMany(): Promise<Attachment[]> {
		const attachments = await prisma.attachment.findMany();

		return attachments.map(AttachmentMapper.toDomain);
	}

	async findManyByMessageId(messageId: string): Promise<Attachment[] | null> {
		const attachments = await prisma.attachment.findMany({
			where: {
				messageId,
			},
		});

		return attachments.map(AttachmentMapper.toDomain);
	}

	async findManyByRoomId(roomId: string): Promise<Attachment[] | null> {
		const attachments = await prisma.attachment.findMany({
			where: {
				roomId,
			},
		});

		return attachments.map(AttachmentMapper.toDomain);
	}

	async findById(id: string): Promise<Attachment | null> {
		const attachment = await prisma.attachment.findUnique({
			where: {
				id,
			},
		});

		if (!attachment) {
			return null;
		}

		return AttachmentMapper.toDomain(attachment);
	}
}
