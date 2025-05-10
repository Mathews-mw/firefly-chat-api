import { Room } from '@/domains/chat/models/entities/room';
import { RoomResponseSchema } from '../../schemas/chat/room-schema';

export class RoomPresenter {
	static toHTTP(data: Room): RoomResponseSchema {
		return {
			id: data.id.toString(),
			type: data.type,
			created_at: data.createdAt,
		};
	}
}
