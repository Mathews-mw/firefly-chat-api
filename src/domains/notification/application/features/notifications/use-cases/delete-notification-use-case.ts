import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { INotificationRepository } from '../repositories/notification-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { NotificationDetails } from '@/domains/notification/models/value-objects/notification-details';
import { IUserRepository } from '@/domains/chat/application/features/users/repositories/user-repository';
import { ForbiddenError } from '@/core/errors/forbidden-error';

interface IRequest {
	notificationId: string;
	userId: string;
}

type Response = Outcome<ResourceNotFoundError | ForbiddenError, null>;

@injectable()
export class DeleteNotificationUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.USERS_REPOSITORY) private usersRepository: IUserRepository,
		@inject(DEPENDENCY_IDENTIFIERS.NOTIFICATIONS_REPOSITORY) private notificationsRepository: INotificationRepository
	) {}

	async execute({ notificationId, userId }: IRequest): Promise<Response> {
		const notification = await this.notificationsRepository.findUnique(notificationId);

		if (!notification) {
			return failure(new ResourceNotFoundError('Notification not found', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		if (notification.recipientId.toString() !== userId) {
			return failure(
				new ForbiddenError('You cannot delete a notification that belongs to another user', 'FORBIDDEN_ERROR')
			);
		}

		await this.notificationsRepository.delete(notification.id.toString());

		return success(null);
	}
}
