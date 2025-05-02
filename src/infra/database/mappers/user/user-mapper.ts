import { User } from '@/domains/chat/models/entities/user';
import { User as PrismaUser } from 'prisma/generated/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export class UserMapper {
	static toDomain(data: PrismaUser): User {
		return User.create(
			{
				name: data.name,
				email: data.email,
				password: data.password,
				username: data.username,
				role: data.role,
				avatarUrl: data.avatarUrl,
				isActive: data.isActive,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: User): PrismaUser {
		return {
			id: data.id.toString(),
			name: data.name,
			email: data.email,
			username: data.username,
			password: data.password ?? null,
			role: data.role,
			avatarUrl: data.avatarUrl ?? null,
			isActive: data.isActive,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
