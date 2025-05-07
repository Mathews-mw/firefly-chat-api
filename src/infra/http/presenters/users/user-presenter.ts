import { User } from '@/domains/chat/models/entities/user';
import { UserResponse } from '../../schemas/user/user-schema';

export class UserPresenter {
	static toHTTP(data: User): UserResponse {
		return {
			id: data.id.toString(),
			name: data.name,
			email: data.email,
			username: data.username,
			role: data.role,
			avatar_url: data.avatarUrl ?? null,
			is_active: data.isActive,
			created_at: data.createdAt,
		};
	}
}
