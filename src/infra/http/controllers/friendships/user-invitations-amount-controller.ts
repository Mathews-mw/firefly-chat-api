import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { UserInvitationsAmountQuery } from '../../schemas/friendship/user-invitations-amount-schema';
import { UserInvitationsAmountUseCase } from '@/domains/chat/application/features/friendships/use-cases/user-invitations-amount-use-case';

export async function userInvitationsAmountController(request: FastifyRequest, reply: FastifyReply) {
	const { status } = request.query as UserInvitationsAmountQuery;
	const { sub } = request.user;

	const service = container.resolve(UserInvitationsAmountUseCase);

	const result = await service.execute({
		receiverId: sub,
		status,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send(result.value);
}
