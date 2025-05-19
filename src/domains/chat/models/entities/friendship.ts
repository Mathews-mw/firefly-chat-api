import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AcceptInvitationEvent } from '../../events/accept-invitation-event';

export interface IFriendshipProps {
	userId: UniqueEntityId;
	friendId: UniqueEntityId;
	createdAt: Date;
}

export class Friendship extends Entity<IFriendshipProps> {
	get userId() {
		return this.props.userId;
	}

	set userId(userId: UniqueEntityId) {
		this.props.userId = userId;
	}

	get friendId() {
		return this.props.friendId;
	}

	set friendId(friendId: UniqueEntityId) {
		this.props.friendId = friendId;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	static create(props: Optional<IFriendshipProps, 'createdAt'>, id?: UniqueEntityId) {
		const friendship = new Friendship(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return friendship;
	}
}
