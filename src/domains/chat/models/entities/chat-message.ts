import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IChatMessageProps {
	roomId: UniqueEntityId;
	senderId: UniqueEntityId;
	content: string;
	isDeleted: boolean;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class ChatMessage extends Entity<IChatMessageProps> {
	get roomId() {
		return this.props.roomId;
	}

	set roomId(roomId: UniqueEntityId) {
		this.props.roomId = roomId;
		this._touch();
	}

	get senderId() {
		return this.props.senderId;
	}

	set senderId(senderId: UniqueEntityId) {
		this.props.senderId = senderId;
		this._touch();
	}

	get content() {
		return this.props.content;
	}

	set content(content: string) {
		this.props.content = content;
		this._touch();
	}

	get isDeleted() {
		return this.props.isDeleted;
	}

	set isDeleted(isDeleted: boolean) {
		this.props.isDeleted = isDeleted;
		this._touch();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	private _touch() {
		this.props.updatedAt = new Date();
	}

	static create(props: Optional<IChatMessageProps, 'isDeleted' | 'createdAt'>, id?: UniqueEntityId) {
		const chatMessage = new ChatMessage(
			{
				...props,
				isDeleted: props.isDeleted ?? false,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return chatMessage;
	}
}
