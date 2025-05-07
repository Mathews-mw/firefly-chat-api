import { User } from '../user';
import { IFriendshipProps } from '../friendship';
import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IFriendshipWithFriendProps extends IFriendshipProps {
	id: UniqueEntityId;
	friend: User;
}

export class FriendshipWithFriend extends ValueObject<IFriendshipWithFriendProps> {
	get id() {
		return this.props.id;
	}

	get userId() {
		return this.props.userId;
	}

	get friendId() {
		return this.props.friendId;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get friend() {
		return this.props.friend;
	}

	static create(props: IFriendshipWithFriendProps) {
		const friendshipWithFriend = new FriendshipWithFriend(props);

		return friendshipWithFriend;
	}
}
