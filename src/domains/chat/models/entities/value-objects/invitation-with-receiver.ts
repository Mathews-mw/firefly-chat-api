import { User } from '../user';
import { IInvitationProps } from '../invitation';
import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IInvitationWithReceiverProps extends IInvitationProps {
	id: UniqueEntityId;
	receiver: User;
}

export class InvitationWithReceiver extends ValueObject<IInvitationWithReceiverProps> {
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

	get receiver() {
		return this.props.receiver;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	static create(props: IInvitationWithReceiverProps) {
		const invitationWithReceiver = new InvitationWithReceiver(props);

		return invitationWithReceiver;
	}
}
