import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IParticipantsProps {
	roomId: UniqueEntityId;
	userId: UniqueEntityId;
}

export class Participant extends Entity<IParticipantsProps> {
	get roomId() {
		return this.props.roomId;
	}

	set roomId(roomId: UniqueEntityId) {
		this.props.roomId = roomId;
	}

	get userId() {
		return this.props.userId;
	}

	set userId(userId: UniqueEntityId) {
		this.props.userId = userId;
	}

	static create(props: IParticipantsProps, id?: UniqueEntityId) {
		const room = new Participant(props, id);

		return room;
	}
}
