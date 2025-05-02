import { Session } from '@/domains/chat/models/entities/session';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Session as PrismaSession } from 'prisma/generated/client';

export class SessionMapper {
	static toDomain(data: PrismaSession): Session {
		return Session.create(
			{
				userId: new UniqueEntityId(data.userId),
				sessionToken: data.sessionToken,
				socketId: data.socketId,
				lastSeen: data.lastSeen,
				expiresAt: data.expiresAt,
				registerAt: data.registerAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: Session): PrismaSession {
		return {
			id: data.id.toString(),
			userId: data.userId.toString(),
			sessionToken: data.sessionToken,
			socketId: data.socketId ?? null,
			lastSeen: data.lastSeen ?? null,
			expiresAt: data.expiresAt,
			registerAt: data.registerAt,
		};
	}
}
