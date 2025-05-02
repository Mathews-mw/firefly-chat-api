import { User } from '@/domains/chat/models/entities/user';

export class UserPresenter {
	static toHTTP(data: User) {
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
