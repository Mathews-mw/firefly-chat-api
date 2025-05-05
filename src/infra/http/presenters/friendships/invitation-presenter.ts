import { Invitation } from '@/domains/chat/models/entities/invitation';

export class InvitationPresenter {
	static toHTTP(data: Invitation) {
		return {
			id: data.id.toString(),
			sender_id: data.senderId.toString(),
			receiver_id: data.receiverId.toString(),
			status: data.status,
			replied_at: data.repliedAt ?? null,
			created_at: data.createdAt,
		};
	}
}
