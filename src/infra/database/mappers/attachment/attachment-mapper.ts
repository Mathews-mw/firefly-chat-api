import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Attachment } from '@/domains/chat/models/entities/attachment';
import { Attachment as PrismaAttachment } from 'prisma/generated/client';

export class AttachmentMapper {
	static toDomain(data: PrismaAttachment): Attachment {
		return Attachment.create(
			{
				title: data.title,
				url: data.url,
				messageId: data.messageId ? new UniqueEntityId(data.messageId) : null,
				roomId: data.roomId ? new UniqueEntityId(data.roomId) : null,
				type: data.type,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toDatabase(data: Attachment): PrismaAttachment {
		return {
			id: data.id.toString(),
			title: data.title,
			url: data.url,
			messageId: data.messageId ? data.messageId.toString() : null,
			roomId: data.roomId ? data.roomId.toString() : null,
			type: data.type,
		};
	}
}
