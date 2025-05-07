import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { authMiddleware } from '../middlewares/auth-middleware';
import { sendInvitationSchema } from '../schemas/friendship/send-invitation-schema';
import { acceptInvitationSchema } from '../schemas/friendship/accept-invitation-schema';
import { rejectInvitationSchema } from '../schemas/friendship/reject-invitation-schema';
import { deleteInvitationSchema } from '../schemas/friendship/delete-invitation-schema';
import { sendInvitationController } from '../controllers/friendships/send-invitation-controller';
import { userInvitationsAmountSchema } from '../schemas/friendship/user-invitations-amount-schema';
import { acceptInvitationController } from '../controllers/friendships/accept-invitation-controller';
import { rejectInvitationController } from '../controllers/friendships/reject-invitation-controller';
import { listingUserFriendsResponseSchema } from '../schemas/friendship/listing-user-friends-schema';
import { deleteInvitationController } from '../controllers/friendships/delete-invitation-controller';
import { listingUserFriendsController } from '../controllers/friendships/listing-user-friends-controller';
import { userInvitationsAmountController } from '../controllers/friendships/user-invitations-amount-controller';
import { listingUserSentInvitationsResponseSchema } from '../schemas/friendship/listing-user-sent-invitations-schema';
import { listingUserSentInvitationsController } from '../controllers/friendships/listing-user-sent-invitations-controller';
import { listingUserPendingInvitationsResponseSchema } from '../schemas/friendship/listing-user-pending-invitations-schema';
import { listingUserPendingInvitationsController } from '../controllers/friendships/listing-user-pending-invitations-controller';

export async function friendshipsRoutes(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.post('/invitation', { preHandler: [authMiddleware], schema: sendInvitationSchema }, sendInvitationController);

	app
		.withTypeProvider<ZodTypeProvider>()
		.patch(
			'/invitation/:invitationId/accept',
			{ preHandler: [authMiddleware], schema: acceptInvitationSchema },
			acceptInvitationController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get(
			'/user',
			{ preHandler: [authMiddleware], schema: listingUserFriendsResponseSchema },
			listingUserFriendsController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.patch(
			'/invitation/:invitationId/reject',
			{ preHandler: [authMiddleware], schema: rejectInvitationSchema },
			rejectInvitationController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.delete(
			'/invitation/:invitationId/delete',
			{ preHandler: [authMiddleware], schema: deleteInvitationSchema },
			deleteInvitationController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get(
			'/invitation/user/pending',
			{ preHandler: [authMiddleware], schema: listingUserPendingInvitationsResponseSchema },
			listingUserPendingInvitationsController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get(
			'/invitation/user/amount',
			{ preHandler: [authMiddleware], schema: userInvitationsAmountSchema },
			userInvitationsAmountController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get(
			'/invitation/user/sent',
			{ preHandler: [authMiddleware], schema: listingUserSentInvitationsResponseSchema },
			listingUserSentInvitationsController
		);
}
