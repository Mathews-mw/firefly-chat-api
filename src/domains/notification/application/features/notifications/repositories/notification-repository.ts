import { Notification } from '@/domains/notification/models/notification';
import { IPaginationParams, IPaginationResponse } from '@/core/interfaces/paginating-interfaces';
import { NotificationDetails } from '@/domains/notification/models/value-objects/notification-details';

export interface IFindManyByUserQuery extends IPaginationParams {
	userId: string;
	search?: string;
}

export interface IFindManyByUserResponse {
	pagination: IPaginationResponse;
	notifications: Array<NotificationDetails>;
}

export interface INotificationRepository {
	create(notification: Notification): Promise<Notification>;
	update(notification: Notification): Promise<Notification>;
	delete(notification: Notification): Promise<void>;
	findManyByUserId(query: IFindManyByUserQuery): Promise<IFindManyByUserResponse>;
	findById(id: string): Promise<Notification | null>;
	findUnique(id: string): Promise<NotificationDetails | null>;
}
