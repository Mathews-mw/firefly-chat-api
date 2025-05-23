import { inject, injectable } from 'tsyringe';

import { Json } from '@/core/types/json';
import { Outcome, success } from '@/core/outcome';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Notification } from '@/domains/notification/models/notification';
import { INotificationRepository } from '../repositories/notification-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { INotificationTypeKey } from '@/domains/notification/models/notification-type';
import { EventBus } from '@/core/events/event-bus';

export interface ISendNotificationUseCaseRequest<TRequest extends Json = Json> {
	recipientId: string;
	type: INotificationTypeKey;
	payload: TRequest;
}

export type TSendNotificationUseCaseResponse<TResponse extends Json = Json> = Outcome<
	null,
	{
		notification: Notification<TResponse>;
	}
>;

@injectable()
export class SendNotificationUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.EVENT_BUS) private eventBus: EventBus,
		@inject(DEPENDENCY_IDENTIFIERS.NOTIFICATIONS_REPOSITORY)
		private notificationRepository: INotificationRepository
	) {}

	async execute<T extends Json = Json>({
		recipientId,
		type,
		payload,
	}: ISendNotificationUseCaseRequest<T>): Promise<TSendNotificationUseCaseResponse<T>> {
		const notification = Notification.create<T>({
			recipientId: new UniqueEntityId(recipientId),
			type,
			data: payload,
		});

		await this.notificationRepository.create(notification as Notification<Json>);

		await this.eventBus.publish(...notification.pullDomainEvents());

		return success({
			notification,
		});
	}
}
