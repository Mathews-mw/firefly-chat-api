import { UserPresenter } from '../users/user-presenter';
import { ListingUserFriendsResponse } from '../../schemas/friendship/listing-user-friends-schema';
import { FriendshipWithFriend } from '@/domains/chat/models/entities/value-objects/friendship-with-friend';

export class FriendshipWithPresenterPresenter {
	static toHTTP(data: FriendshipWithFriend): ListingUserFriendsResponse['friends'][number] {
		return {
			id: data.id.toString(),
			user_id: data.userId.toString(),
			friend_id: data.friendId.toString(),
			created_at: data.createdAt,
			friend: UserPresenter.toHTTP(data.friend),
		};
	}
}
