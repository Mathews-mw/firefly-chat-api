import { Attachment } from '@/domains/chat/models/entities/attachment';

export class AttachmentPresenter {
	static toHTTP(data: Attachment) {
		return {
			id: data.id.toString(),
			title: data.title,
			url: data.url,
			room_id: data.roomId ? data.roomId.toString() : null,
			message_id: data.messageId ? data.messageId.toString() : null,
		};
	}
}
