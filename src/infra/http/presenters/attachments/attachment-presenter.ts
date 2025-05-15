import { Attachment } from '@/domains/chat/models/entities/attachment';
import { AttachmentResponseSchema } from '../../schemas/attachment/attachment-schema';

export class AttachmentPresenter {
	static toHTTP(data: Attachment): AttachmentResponseSchema {
		return {
			id: data.id.toString(),
			title: data.title,
			url: data.url,
			room_id: data.roomId ? data.roomId.toString() : null,
			message_id: data.messageId ? data.messageId.toString() : null,
			type: data.type,
		};
	}
}
