import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface ISessionProps {
	userId: UniqueEntityId;
	sessionToken: string;
	socketId?: string | null;
	lastSeen?: Date | null;
	expiresAt: Date;
	registerAt: Date;
}

export class Session extends Entity<ISessionProps> {
	get userId() {
		return this.props.userId;
	}

	set userId(userId: UniqueEntityId) {
		this.props.userId = userId;
	}

	get sessionToken() {
		return this.props.sessionToken;
	}

	set sessionToken(sessionToken: string) {
		this.props.sessionToken = sessionToken;
	}

	get socketId() {
		return this.props.socketId;
	}

	set socketId(socketId: string | null | undefined) {
		this.props.socketId = socketId;
	}

	get lastSeen() {
		return this.props.lastSeen;
	}

	set lastSeen(lastSeen: Date | null | undefined) {
		this.props.lastSeen = lastSeen;
	}

	get expiresAt() {
		return this.props.expiresAt;
	}

	set expiresAt(expiresAt: Date) {
		this.props.expiresAt = expiresAt;
	}

	get registerAt() {
		return this.props.registerAt;
	}

	set registerAt(registerAt: Date) {
		this.props.registerAt = registerAt;
	}

	static create(props: Optional<ISessionProps, 'registerAt'>, id?: UniqueEntityId) {
		const session = new Session({ ...props, registerAt: props.registerAt ?? new Date() }, id);

		return session;
	}
}
