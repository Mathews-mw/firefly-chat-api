import { inject, injectable } from 'tsyringe';

import { Outcome, success } from '@/core/outcome';
import { INotificationRepository } from '../repositories/notification-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	userId: string;
}

type Response = Outcome<
	null,
	{
		total: number;
		read: number;
		unread: number;
	}
>;

@injectable()
export class GetAmountNotificationsUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.NOTIFICATIONS_REPOSITORY) private notificationsRepository: INotificationRepository
	) {}

	async execute({ userId }: IRequest): Promise<Response> {
		const result = await this.notificationsRepository.notificationsAmount(userId);

		return success(result);
	}
}
