import { hash } from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { User } from '@/domains/chat/models/entities/user';
import cryptographyConfig from '@/config/cryptography-config';
import { Account } from '@/domains/chat/models/entities/account';
import { IUserRepository } from '../repositories/user-repository';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { IAccountRepository } from '../repositories/account-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	name: string;
	email: string;
	password: string;
	username: string;
	avatarUrl?: string;
}

type Response = Outcome<BadRequestError, { user: User }>;

@injectable()
export class CreateUserUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.USERS_REPOSITORY) private usersRepository: IUserRepository,
		@inject(DEPENDENCY_IDENTIFIERS.ACCOUNTS_REPOSITORY) private accountsRepository: IAccountRepository
	) {}

	async execute({ name, email, password, username, avatarUrl }: IRequest): Promise<Response> {
		const userWithSameEmail = await this.usersRepository.findByEmail(email);

		if (userWithSameEmail) {
			return failure(new BadRequestError('User with same e-mail already exists', 'SAME_EMAIL_ERROR'));
		}

		const usernameAlreadyExists = await this.usersRepository.findUnique({ username });

		if (usernameAlreadyExists) {
			return failure(new BadRequestError('User with same username already exists', 'SAME_USERNAME_ERROR'));
		}

		const hashPassword = await hash(password, cryptographyConfig.HASH_SALT_LENGTH);

		const newUser = User.create({
			name,
			email,
			username,
			password: hashPassword,
			avatarUrl,
		});

		const newAccount = Account.create({
			userId: newUser.id,
			provider: 'CREDENTIALS',
			providerAccountId: randomUUID(),
		});

		await this.usersRepository.create(newUser);
		await this.accountsRepository.create(newAccount);

		return success({ user: newUser });
	}
}
