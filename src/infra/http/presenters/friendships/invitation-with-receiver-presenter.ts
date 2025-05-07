import { UserPresenter } from '../users/user-presenter';
import { InvitationWithReceiver } from '@/domains/chat/models/entities/value-objects/invitation-with-receiver';

export class InvitationWithReceiverPresenter {
	static toHTTP(data: InvitationWithReceiver) {
		return {
			id: data.id.toString(),
			sender_id: data.receiverId.toString(),
			receiver_id: data.receiverId.toString(),
			status: data.status,
			replied_at: data.repliedAt ?? null,
			created_at: data.createdAt,
			receiver: UserPresenter.toHTTP(data.receiver),
		};
	}
}
