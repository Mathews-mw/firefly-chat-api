import { UserPresenter } from '../users/user-presenter';
import { InvitationWithSender } from '@/domains/chat/models/entities/value-objects/invitation-with-sender';

export class InvitationWithSenderPresenter {
	static toHTTP(data: InvitationWithSender) {
		return {
			id: data.id.toString(),
			sender_id: data.senderId.toString(),
			receiver_id: data.receiverId.toString(),
			status: data.status,
			replied_at: data.repliedAt ?? null,
			created_at: data.createdAt,
			sender: UserPresenter.toHTTP(data.sender),
		};
	}
}
