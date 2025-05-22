import { inject, injectable } from 'tsyringe';

import { Outcome, success } from '@/core/outcome';
import { Room } from '@/domains/chat/models/entities/room';
import { IRoomRepository } from '../repositories/room-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Participant } from '@/domains/chat/models/entities/participant';
import { IParticipantRepository } from '../repositories/participant-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	userId: string;
	name: string;
	description?: string;
	imageUrl?: string;
}

type Response = Outcome<null, { room: Room }>;

@injectable()
export class CreateGroupRoomUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.ROOMS_REPOSITORY) private roomsRepository: IRoomRepository,
		@inject(DEPENDENCY_IDENTIFIERS.PARTICIPANTS_REPOSITORY) private participantsRepository: IParticipantRepository
	) {}

	async execute({ userId, name, description, imageUrl }: IRequest): Promise<Response> {
		const newRom = Room.create({
			name,
			description,
			imageUrl,
			type: 'GROUP',
		});

		const userParticipant = Participant.create({
			roomId: newRom.id,
			userId: new UniqueEntityId(userId),
		});

		await this.roomsRepository.create(newRom);
		await this.participantsRepository.create(userParticipant);

		return success({ room: newRom });
	}
}
