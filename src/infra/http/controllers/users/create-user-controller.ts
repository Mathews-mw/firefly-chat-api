import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { CreateUserRequest } from '../../schemas/user/create-user-schema';
import { CreateUserUseCase } from '@/domains/chat/application/features/users/use-cases/create-user-use-case';

export async function createUserController(request: FastifyRequest, reply: FastifyReply) {
	const { name, email, password, username } = request.body as CreateUserRequest;

	const service = container.resolve(CreateUserUseCase);

	const result = await service.execute({
		name,
		email,
		password,
		username,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(201).send({ message: 'User created successfully', user_id: result.value.user.id.toString() });
}
