import { z } from 'zod';

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const invitationStatusSchema = z.union([z.literal('PENDING'), z.literal('ACCEPTED'), z.literal('REJECTED')]);

export type IInvitationStatus = z.infer<typeof invitationStatusSchema>;

export interface IInvitationProps {
	senderId: UniqueEntityId;
	receiverId: UniqueEntityId;
	status: IInvitationStatus;
	repliedAt?: Date | null;
	createdAt: Date;
}

export class Invitation extends Entity<IInvitationProps> {
	get senderId() {
		return this.props.senderId;
	}

	set senderId(senderId: UniqueEntityId) {
		this.props.senderId = senderId;
	}

	get receiverId() {
		return this.props.receiverId;
	}

	set receiverId(receiverId: UniqueEntityId) {
		this.props.receiverId = receiverId;
	}

	get status() {
		return this.props.status;
	}

	set status(status: IInvitationStatus) {
		this.props.status = status;
	}

	get repliedAt() {
		return this.props.repliedAt;
	}

	set repliedAt(repliedAt: Date | null | undefined) {
		this.props.repliedAt = repliedAt;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	static create(props: Optional<IInvitationProps, 'createdAt' | 'status'>, id?: UniqueEntityId) {
		const invitation = new Invitation(
			{
				...props,
				status: props.status ?? 'PENDING',
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return invitation;
	}
}
