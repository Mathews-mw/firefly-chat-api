import { IRoomProps } from '../room';
import { Attachment } from '../attachment';
import { ValueObject } from '@/core/entities/value-object';
import { ParticipantWithUser } from './participant-with-user';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IRoomDetailsProps extends IRoomProps {
	id: UniqueEntityId;
	participants: Array<ParticipantWithUser>;
	attachments: Array<Attachment>;
}

export class RoomDetails extends ValueObject<IRoomDetailsProps> {
	get id() {
		return this.props.id;
	}

	get type() {
		return this.props.type;
	}

	get name() {
		return this.props.name;
	}

	get description() {
		return this.props.description;
	}

	get imageUrl() {
		return this.props.imageUrl;
	}

	get ownerId() {
		return this.props.ownerId;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get participants() {
		return this.props.participants;
	}

	get attachments() {
		return this.props.attachments;
	}

	static create(props: IRoomDetailsProps) {
		const roomDetails = new RoomDetails(props);

		return roomDetails;
	}
}
