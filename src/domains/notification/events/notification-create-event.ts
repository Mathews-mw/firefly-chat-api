import { Json } from '@/core/types/json';
import { Notification } from '../models/notification';
import { DomainEvent } from '@/core/events/domain-event';

export class NotificationCreateEvent<T = Json> implements DomainEvent {
	public readonly occurredOn: Date;
	public notification: Notification<T>;

	constructor(notification: Notification<T>) {
		this.occurredOn = new Date();
		this.notification = notification;
	}
}
