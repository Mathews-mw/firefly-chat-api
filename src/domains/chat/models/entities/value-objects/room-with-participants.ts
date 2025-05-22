import { IRoomProps } from '../room';
import { ValueObject } from '@/core/entities/value-object';
import { ParticipantWithUser } from './participant-with-user';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ChatMessageWithAuthor } from './chat-message-with-author';

export interface IRoomWithParticipantsProps extends IRoomProps {
	id: UniqueEntityId;
	participants: Array<ParticipantWithUser>;
	chatMessages: Array<ChatMessageWithAuthor>;
}

export class RoomWithParticipants extends ValueObject<IRoomWithParticipantsProps> {
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

	get chatMessages() {
		return this.props.chatMessages;
	}

	static create(props: IRoomWithParticipantsProps) {
		const roomWithParticipants = new RoomWithParticipants(props);

		return roomWithParticipants;
	}
}
