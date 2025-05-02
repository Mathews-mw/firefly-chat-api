import { prisma } from '../prisma';
import { UserMapper } from '../mappers/user/user-mapper';
import { User } from '@/domains/chat/models/entities/user';
import {
	IUserRepository,
	IFindUniqueParams,
	IUserQuerySearch,
} from '@/domains/chat/application/features/users/repositories/user-repository';

export class PrismaUsersRepository implements IUserRepository {
	async create(user: User) {
		const data = UserMapper.toPrisma(user);

		await prisma.user.create({
			data,
		});

		return user;
	}

	async update(user: User) {
		const data = UserMapper.toPrisma(user);

		await prisma.user.update({
			data,
			where: {
				id: data.id,
			},
		});

		return user;
	}

	async delete(user: User): Promise<void> {
		await prisma.user.delete({
			where: {
				id: user.id.toString(),
			},
		});
	}

	async findMany(query: IUserQuerySearch) {
		const users = await prisma.user.findMany();

		return users.map(UserMapper.toDomain);
	}

	async findById(id: string) {
		const user = await prisma.user.findUnique({
			where: {
				id,
			},
		});

		if (!user) {
			return null;
		}

		return UserMapper.toDomain(user);
	}

	async findByEmail(email: string) {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			return null;
		}

		return UserMapper.toDomain(user);
	}

	async findUnique({ id, email, username }: IFindUniqueParams) {
		const user = await prisma.user.findUnique({
			where: {
				id,
				email,
				username,
			},
		});

		if (!user) {
			return null;
		}

		return UserMapper.toDomain(user);
	}
}
