import { User } from '../user';
import { IChatMessageProps } from '../chat-message';
import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ReadReceipt } from '../read-receipt';

export interface IChatMessageWithAuthorProps extends IChatMessageProps {
	id: UniqueEntityId;
	author: User;
	readReceipts: Array<ReadReceipt>;
}

export class ChatMessageWithAuthor extends ValueObject<IChatMessageWithAuthorProps> {
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

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get author() {
		return this.props.author;
	}

	get readReceipts() {
		return this.props.readReceipts;
	}

	static create(props: IChatMessageWithAuthorProps) {
		const chatMessageWithAuthor = new ChatMessageWithAuthor(props);

		return chatMessageWithAuthor;
	}
}
