import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { authMiddleware } from '../middlewares/auth-middleware';
import { getRoomSchema } from '../schemas/chat/get-room-schema';
import { createRoomSchema } from '../schemas/chat/create-room-schema';
import { getRoomController } from '../controllers/chat/get-room-controller';
import { getRoomDetailsSchema } from '../schemas/chat/get-room-details-schema';
import { createRoomController } from '../controllers/chat/create-room-controller';
import { getRoomDetailsController } from '../controllers/chat/get-room-details-controller';
import { listingUserPrivateRoomsSchema } from '../schemas/chat/listing-user-private-rooms-schema';
import { listingUserPrivateRooms } from '../controllers/chat/listing-user-private-rooms-controller';
import { listingUserChatMessageByRoomSchema } from '../schemas/chat/listing-user-chat-message-by-room-schema';
import { listingUserChatMessageByRoomController } from '../controllers/chat/listing-user-chat-message-by-room-controller';

export async function chatRoutes(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.post('/room', { preHandler: [authMiddleware], schema: createRoomSchema }, createRoomController);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get('/room/:roomId', { preHandler: [authMiddleware], schema: getRoomSchema }, getRoomController);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get(
			'/room/:roomId/details',
			{ preHandler: [authMiddleware], schema: getRoomDetailsSchema },
			getRoomDetailsController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get(
			'/room/private/user',
			{ preHandler: [authMiddleware], schema: listingUserPrivateRoomsSchema },
			listingUserPrivateRooms
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get(
			'/room/:roomId/messages',
			{ preHandler: [authMiddleware], schema: listingUserChatMessageByRoomSchema },
			listingUserChatMessageByRoomController
		);
}
