import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { authMiddleware } from '../middlewares/auth-middleware';
import { getNotificationResponseSchema } from '../schemas/notification/get-notification-schema';
import { getNotificationController } from '../controllers/notifications/get-notification-controller';
import { deleteNotificationResponseSchema } from '../schemas/notification/delete-notification.schema';
import { readingNotificationsResponseSchema } from '../schemas/notification/reading-notifications-schema';
import { deleteNotificationController } from '../controllers/notifications/delete-notification-controller';
import { readingNotificationsController } from '../controllers/notifications/reading-notifications-controller';
import { listingUserNotificationsResponseSchema } from '../schemas/notification/listing-user-notifications-schema';
import { listingUserNotificationsController } from '../controllers/notifications/listing-user-notifications-controller';
import { listingUserNotificationsCursorResponseSchema } from '../schemas/notification/listing-user-notifications-cursor-schema';
import { listingUserNotificationsCursorController } from '../controllers/notifications/listing-user-notifications-cursor-controller';
import { getAmountNotificationsController } from '../controllers/notifications/get-amount-notifications-controller';
import { getAmountNotificationsResponseSchema } from '../schemas/notification/get-amount-notifications-schema';

export async function notificationsRoutes(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.patch(
			'/read',
			{ preHandler: [authMiddleware], schema: readingNotificationsResponseSchema },
			readingNotificationsController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.delete(
			'/:notificationId',
			{ preHandler: [authMiddleware], schema: deleteNotificationResponseSchema },
			deleteNotificationController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get(
			'/',
			{ preHandler: [authMiddleware], schema: listingUserNotificationsResponseSchema },
			listingUserNotificationsController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get(
			'/cursor',
			{ preHandler: [authMiddleware], schema: listingUserNotificationsCursorResponseSchema },
			listingUserNotificationsCursorController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get(
			'/:notificationId',
			{ preHandler: [authMiddleware], schema: getNotificationResponseSchema },
			getNotificationController
		);

	app.get(
		'/amount',
		{ preHandler: [authMiddleware], schema: getAmountNotificationsResponseSchema },
		getAmountNotificationsController
	);
}
