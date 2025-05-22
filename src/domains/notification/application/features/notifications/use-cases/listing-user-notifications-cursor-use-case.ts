import { inject, injectable } from 'tsyringe';

import { Outcome, success } from '@/core/outcome';
import { ForbiddenError } from '@/core/errors/forbidden-error';
import { INotificationRepository } from '../repositories/notification-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { INotificationTypeKey } from '@/domains/notification/models/notification-type';
import { ICursorParams, ICursorResponse } from '@/core/interfaces/paginating-interfaces';
import { NotificationDetails } from '@/domains/notification/models/value-objects/notification-details';

interface IRequest extends ICursorParams {
	userId: string;
	type?: INotificationTypeKey;
	isRead?: boolean;
}

type Response = Outcome<
	ForbiddenError,
	{
		cursor: ICursorResponse;
		notifications: Array<NotificationDetails<{ title: string; content: string; metadata?: {} | null }>>;
	}
>;

@injectable()
export class ListingUserNotificationsCursorUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.NOTIFICATIONS_REPOSITORY) private notificationsRepository: INotificationRepository
	) {}

	async execute({ limit, cursor, skip, userId, type, isRead }: IRequest): Promise<Response> {
		const response = await this.notificationsRepository.findManyCursor<{
			title: string;
			content: string;
			metadata?: {} | null;
		}>({
			limit,
			cursor,
			skip,
			userId,
			type,
			isRead,
		});

		return success({
			cursor: response.cursor,
			notifications: response.notifications,
		});
	}
}
