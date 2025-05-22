import { container, inject, injectable } from 'tsyringe';

import { EventHandler } from '@/core/events/event-bus';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { InvitationSentEvent } from '@/domains/chat/events/invitation-sent-event';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { IUserRepository } from '@/domains/chat/application/features/users/repositories/user-repository';
import { SendNotificationUseCase } from '../application/features/notifications/use-cases/send-notification-use-case';

@injectable()
export class NotifyOnInvitationSent implements EventHandler<InvitationSentEvent> {
	constructor(
		private notificationService: SendNotificationUseCase,
		@inject(DEPENDENCY_IDENTIFIERS.USERS_REPOSITORY) private usersRepository: IUserRepository
	) {
		this.notificationService = container.resolve(SendNotificationUseCase);
	}

	async handler(event: InvitationSentEvent): Promise<void> {
		const receiver = await this.usersRepository.findById(event.invitation.receiverId.toString());
		const sender = await this.usersRepository.findById(event.invitation.senderId.toString());

		if (!receiver || !sender) {
			throw new ResourceNotFoundError('User not found', 'RESOURCE_NOT_FOUND_ERROR');
		}

		await this.notificationService.execute<{
			title: string;
			content: string;
			metadata: {
				inviteId: string;
				senderId: string;
				senderName: string;
				senderAvatarUrl?: string | null;
			};
		}>({
			recipientId: event.invitation.receiverId.toString(),
			type: 'FRIEND_REQUEST',
			payload: {
				title: 'Novo convite de amizade',
				content: `${receiver.name.split(' ')[0]}, você recebeu um pedido de amizade de ${sender.name}. Confira mais detalhes na seção de convites na sua lista de amigos.`,
				metadata: {
					inviteId: event.invitation.id.toString(),
					senderId: event.invitation.senderId.toString(),
					senderName: sender.name,
					senderAvatarUrl: sender.avatarUrl,
				},
			},
		});
	}
}
