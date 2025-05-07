import { User } from '../user';
import { IInvitationProps } from '../invitation';
import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IInvitationWithSenderProps extends IInvitationProps {
	id: UniqueEntityId;
	sender: User;
}

export class InvitationWithSender extends ValueObject<IInvitationWithSenderProps> {
	get id() {
		return this.props.id;
	}

	get senderId() {
		return this.props.senderId;
	}

	get receiverId() {
		return this.props.receiverId;
	}

	get status() {
		return this.props.status;
	}

	get repliedAt() {
		return this.props.repliedAt;
	}

	get sender() {
		return this.props.sender;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	static create(props: IInvitationWithSenderProps) {
		const invitationWithSender = new InvitationWithSender(props);

		return invitationWithSender;
	}
}
