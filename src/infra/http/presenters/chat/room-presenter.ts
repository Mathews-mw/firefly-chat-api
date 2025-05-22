import { Room } from '@/domains/chat/models/entities/room';
import { RoomResponseSchema } from '../../schemas/chat/room-schema';

export class RoomPresenter {
	static toHTTP(data: Room): RoomResponseSchema {
		return {
			id: data.id.toString(),
			type: data.type,
			name: data.name,
			description: data.description,
			image_url: data.imageUrl,
			owner_id: data.ownerId ? data.ownerId.toString() : null,
			created_at: data.createdAt,
		};
	}
}
