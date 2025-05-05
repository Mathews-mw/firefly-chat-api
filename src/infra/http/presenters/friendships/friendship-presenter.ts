import { Friendship } from '@/domains/chat/models/entities/friendship';

export class FriendshipPresenter {
	static toHTTP(data: Friendship) {
		return {
			id: data.id.toString(),
			user_id: data.userId.toString(),
			friend_id: data.friendId.toString(),
			created_at: data.createdAt,
		};
	}
}
