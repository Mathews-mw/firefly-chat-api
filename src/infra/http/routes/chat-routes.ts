import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { authMiddleware } from '../middlewares/auth-middleware';
import { getRoomSchema } from '../schemas/chat/get-room-schema';
import { createRoomSchema } from '../schemas/chat/create-room-schema';
import { getRoomController } from '../controllers/chat/get-room-controller';
import { getRoomDetailsSchema } from '../schemas/chat/get-room-details-schema';
import { createGroupRoomSchema } from '../schemas/chat/create-group-room-schema';
import { createRoomController } from '../controllers/chat/create-room-controller';
import { listingUserRoomsSchema } from '../schemas/chat/listing-user-rooms-schema';
import { getRoomDetailsController } from '../controllers/chat/get-room-details-controller';
import { createGroupRoomController } from '../controllers/chat/create-group-room-controller';
import { listingUserRoomsController } from '../controllers/chat/listing-user-rooms-controller';
import { addParticipantsToRoomSchema } from '../schemas/chat/add-participants-to-room-schema';
import { removeParticipantFromRoomSchema } from '../schemas/chat/remove-participant-from-room-schema';
import { addParticipantsToRoomController } from '../controllers/chat/add-participants-to-room-controller';
import { listingUserChatMessageByRoomSchema } from '../schemas/chat/listing-user-chat-message-by-room-schema';
import { removeParticipantFromRoomController } from '../controllers/chat/remove-participant-from-room-controller';
import { listingUserChatMessageByRoomController } from '../controllers/chat/listing-user-chat-message-by-room-controller';

export async function chatRoutes(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.post('/room', { preHandler: [authMiddleware], schema: createRoomSchema }, createRoomController);

	app
		.withTypeProvider<ZodTypeProvider>()
		.post('/room/group', { preHandler: [authMiddleware], schema: createGroupRoomSchema }, createGroupRoomController);

	app
		.withTypeProvider<ZodTypeProvider>()
		.patch(
			'/room/group/:roomId/participants/add',
			{ preHandler: [authMiddleware], schema: addParticipantsToRoomSchema },
			addParticipantsToRoomController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.patch(
			'/room/group/:roomId/participants/remove',
			{ preHandler: [authMiddleware], schema: removeParticipantFromRoomSchema },
			removeParticipantFromRoomController
		);

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
		.get('/room/user', { preHandler: [authMiddleware], schema: listingUserRoomsSchema }, listingUserRoomsController);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get(
			'/room/:roomId/messages',
			{ preHandler: [authMiddleware], schema: listingUserChatMessageByRoomSchema },
			listingUserChatMessageByRoomController
		);
}
