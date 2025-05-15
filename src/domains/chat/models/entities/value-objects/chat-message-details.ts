import { User } from '../user';
import { Room } from '../room';
import { ReadReceipt } from '../read-receipt';
import { IChatMessageProps } from '../chat-message';
import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Attachment } from '../attachment';

export interface IChatMessageDetailsProps extends IChatMessageProps {
	id: UniqueEntityId;
	author: User;
	room: Room;
	readReceipts: Array<ReadReceipt>;
	attachments: Array<Attachment>;
}

export class ChatMessageDetails extends ValueObject<IChatMessageDetailsProps> {
	get id() {
		return this.props.id;
	}

	get roomId() {
		return this.props.roomId;
	}

	get senderId() {
		return this.props.senderId;
	}

	get content() {
		return this.props.content;
	}

	get isDeleted() {
		return this.props.isDeleted;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get author() {
		return this.props.author;
	}

	get room() {
		return this.props.room;
	}

	get readReceipts() {
		return this.props.readReceipts;
	}

	get attachments() {
		return this.props.attachments;
	}

	static create(props: IChatMessageDetailsProps) {
		const chatMessageDetails = new ChatMessageDetails(props);

		return chatMessageDetails;
	}
}
