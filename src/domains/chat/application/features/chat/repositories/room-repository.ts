import { Room, RoomType } from '@/domains/chat/models/entities/room';
import { RoomDetails } from '@/domains/chat/models/entities/value-objects/room-details';
import { ICursorParams, ICursorResponse } from '@/core/interfaces/paginating-interfaces';
import { RoomWithParticipants } from '@/domains/chat/models/entities/value-objects/room-with-participants';

export interface IRoomQuerySearch {
	search?: string;
	type?: RoomType;
}

export interface IWithParticipantsParams {
	roomId: string;
	type?: RoomType;
	userId?: string;
}

export interface IFindUniqueParams {
	firstSubjectId: string;
	secondSubjectId: string;
	type?: RoomType;
}

export interface IFindManyRoomsByUserSearchCursor extends ICursorParams {
	userId: string;
	type?: RoomType;
}

export interface IFindManyRoomsCursorResponse extends ICursorResponse {
	rooms: Array<RoomWithParticipants>;
	type?: RoomType;
}

export interface IRoomRepository {
	create(room: Room): Promise<Room>;
	update(room: Room): Promise<Room>;
	delete(room: Room): Promise<void>;
	findMany(query: IRoomQuerySearch): Promise<Array<Room>>;
	findManyByUser(params: IFindManyRoomsByUserSearchCursor): Promise<IFindManyRoomsCursorResponse>;
	findById(id: string): Promise<Room | null>;
	findWithParticipants(params: IWithParticipantsParams): Promise<RoomWithParticipants | null>;
	findDetails(id: string, isPrivate?: boolean): Promise<RoomDetails | null>;

	/**Search for existing room with exactly these 2 participants
	 * @param firstSubjectId: First participant's id
	 * @param secondSubjectId: Second participant's id
	 */
	findUniqueByParticipants(params: IFindUniqueParams): Promise<RoomWithParticipants | null>;
}
