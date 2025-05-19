import { container, inject, injectable } from 'tsyringe';

import { EventHandler } from '@/core/events/event-bus';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { AcceptInvitationEvent } from '@/domains/chat/events/accept-invitation-event';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { IUserRepository } from '@/domains/chat/application/features/users/repositories/user-repository';
import { SendNotificationUseCase } from '../application/features/notifications/use-cases/send-notification-use-case';

@injectable()
export class NotifyOnAcceptInvitation implements EventHandler<AcceptInvitationEvent> {
	constructor(
		private notificationService: SendNotificationUseCase,
		@inject(DEPENDENCY_IDENTIFIERS.USERS_REPOSITORY) private usersRepository: IUserRepository
	) {
		this.notificationService = container.resolve(SendNotificationUseCase);
	}

	async handler(event: AcceptInvitationEvent): Promise<void> {
		console.log('notification handler: ', event);
		const receiver = await this.usersRepository.findById(event.friendship.friendId.toString());
		const requester = await this.usersRepository.findById(event.friendship.userId.toString());

		if (!receiver || !requester) {
			throw new ResourceNotFoundError('User not found', 'RESOURCE_NOT_FOUND_ERROR');
		}

		await this.notificationService.execute({
			recipientId: event.friendship.userId.toString(),
			type: 'FRIEND_ACCEPTED',
			payload: {
				title: 'Pedido de amizade aceito!',
				content: `Uhuul!!! ${requester.name.split(' ')[0]}, seu pedido de amizade enviado para ${receiver.name} foi aceito! 🎉.`,
			},
		});
	}
}
