import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IReadReceiptProps {
	messageId: UniqueEntityId;
	userId: UniqueEntityId;
	readAt: Date;
}

export class ReadReceipt extends Entity<IReadReceiptProps> {
	get messageId() {
		return this.props.messageId;
	}

	set messageId(messageId: UniqueEntityId) {
		this.props.messageId = messageId;
	}

	get userId() {
		return this.props.userId;
	}

	set userId(userId: UniqueEntityId) {
		this.props.userId = userId;
	}

	get readAt() {
		return this.props.readAt;
	}

	static create(props: Optional<IReadReceiptProps, 'readAt'>) {
		const readReceipt = new ReadReceipt({
			...props,
			readAt: new Date(),
		});

		return readReceipt;
	}
}
