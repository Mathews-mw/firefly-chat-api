import { AttachmentPresenter } from '../attachments/attachment-presenter';
import { ParticipantWithUserPresenter } from './participant-with-user-presenter';
import { RoomDetails } from '@/domains/chat/models/entities/value-objects/room-details';

export class RoomDetailsPresenter {
	static toHTTP(data: RoomDetails) {
		return {
			id: data.id.toString(),
			type: data.type,
			name: data.name,
			description: data.description,
			image_url: data.imageUrl,
			owner_id: data.ownerId ? data.ownerId.toString() : null,
			created_at: data.createdAt,
			participants: data.participants.map(ParticipantWithUserPresenter.toHTTP),
			attachments: data.attachments.map(AttachmentPresenter.toHTTP),
		};
	}
}
