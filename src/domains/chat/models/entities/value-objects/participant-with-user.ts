import { User } from '../user';
import { IParticipantsProps } from '../participant';
import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IParticipantWithUserProps extends IParticipantsProps {
	id: UniqueEntityId;
	user: User;
}

export class ParticipantWithUser extends ValueObject<IParticipantWithUserProps> {
	get id() {
		return this.props.id;
	}

	get roomId() {
		return this.props.roomId;
	}

	get userId() {
		return this.props.userId;
	}

	get user() {
		return this.props.user;
	}

	static create(props: IParticipantWithUserProps) {
		const participantWithUser = new ParticipantWithUser(props);

		return participantWithUser;
	}
}
