import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { INotificationRepository } from '../repositories/notification-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { NotificationDetails } from '@/domains/notification/models/value-objects/notification-details';

interface IRequest {
	notificationId: string;
}

type Response = Outcome<
	ResourceNotFoundError,
	{ notification: NotificationDetails<{ title: string; content: string; metadata?: {} | null }> }
>;

@injectable()
export class GetNotificationUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.NOTIFICATIONS_REPOSITORY) private notificationsRepository: INotificationRepository
	) {}

	async execute({ notificationId }: IRequest): Promise<Response> {
		const notification = await this.notificationsRepository.findUnique<{
			title: string;
			content: string;
			metadata?: {} | null;
		}>(notificationId);

		if (!notification) {
			return failure(new ResourceNotFoundError('Notification not found', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		return success({ notification });
	}
}
