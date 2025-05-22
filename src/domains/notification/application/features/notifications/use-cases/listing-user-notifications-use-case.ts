import { inject, injectable } from 'tsyringe';

import { Outcome, success } from '@/core/outcome';
import { INotificationRepository } from '../repositories/notification-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { IPaginationParams, IPaginationResponse } from '@/core/interfaces/paginating-interfaces';
import { NotificationDetails } from '@/domains/notification/models/value-objects/notification-details';

interface IRequest extends IPaginationParams {
	userId: string;
}

type Response = Outcome<
	null,
	{
		pagination: IPaginationResponse;
		notifications: Array<NotificationDetails<{ title: string; content: string; metadata?: {} | null }>>;
	}
>;

@injectable()
export class ListingUserNotificationsUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.NOTIFICATIONS_REPOSITORY) private notificationsRepository: INotificationRepository
	) {}

	async execute({ page, perPage, userId }: IRequest): Promise<Response> {
		const { pagination, notifications } = await this.notificationsRepository.findManyByUserId<{
			title: string;
			content: string;
			metadata?: {} | null;
		}>({
			page,
			perPage,
			userId,
		});

		return success({ pagination, notifications });
	}
}
