import { Notification } from '@/domains/notification/models/notification';
import { NotificationDetails } from '@/domains/notification/models/value-objects/notification-details';
import {
	ICursorParams,
	ICursorResponse,
	IPaginationParams,
	IPaginationResponse,
} from '@/core/interfaces/paginating-interfaces';
import {
	INotificationTypeKey,
	INotificationTypeProps,
	NotificationType,
} from '@/domains/notification/models/notification-type';
import { Json } from '@/core/types/json';

export interface IFindManyByUserQuery extends IPaginationParams {
	userId: string;
	search?: string;
	isRead?: boolean;
}

export interface INotificationCursorParams extends ICursorParams {
	userId: string;
	type?: INotificationTypeKey;
	isRead?: boolean;
}

export interface IFindManyByUserResponse<T extends Json = Json> {
	pagination: IPaginationResponse;
	notifications: Array<NotificationDetails<T>>;
}

export interface INotificationCursorResponse<T extends Json = Json> {
	cursor: ICursorResponse;
	notifications: Array<NotificationDetails<T>>;
}

export interface AmountNotificationsResponse {
	total: number;
	read: number;
	unread: number;
}

export interface INotificationRepository {
	create(notification: Notification): Promise<Notification>;
	update(notification: Notification): Promise<Notification>;
	delete(notificationId: string): Promise<void>;
	findManyByUserId<T extends Json = Json>(query: IFindManyByUserQuery): Promise<IFindManyByUserResponse<T>>;
	findManyCursor<T extends Json = Json>(query: INotificationCursorParams): Promise<INotificationCursorResponse<T>>;
	findById(id: string): Promise<Notification | null>;
	findUnique<T extends Json = Json>(id: string): Promise<NotificationDetails<T> | null>;
	notificationsAmount(userId: string): Promise<AmountNotificationsResponse>;
	getNotificationType(type: INotificationTypeKey): Promise<NotificationType | null>;
}
