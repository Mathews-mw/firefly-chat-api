import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { Room } from '@/domains/chat/models/entities/room';
import { ForbiddenError } from '@/core/errors/forbidden-error';
import { IRoomRepository } from '../repositories/room-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Participant } from '@/domains/chat/models/entities/participant';
import { IParticipantRepository } from '../repositories/participant-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { IFriendshipRepository } from '../../friendships/repositories/friendship-repository';

interface IRequest {
	userId: string;
	guestId: string;
}

type Response = Outcome<ForbiddenError, { room: Room }>;

@injectable()
export class CreateRoomUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.ROOMS_REPOSITORY) private roomsRepository: IRoomRepository,
		@inject(DEPENDENCY_IDENTIFIERS.FRIENDSHIPS_REPOSITORY) private friendShipsRepository: IFriendshipRepository,
		@inject(DEPENDENCY_IDENTIFIERS.PARTICIPANTS_REPOSITORY) private participantsRepository: IParticipantRepository
	) {}

	async execute({ userId, guestId }: IRequest): Promise<Response> {
		const isFriendOf = await this.friendShipsRepository.findUnique({ userId, friendId: guestId });

		if (!isFriendOf) {
			return failure(
				new ForbiddenError('You cannot invite someone who is not on your friends list', 'FORBIDDEN_ERROR')
			);
		}

		const room = await this.roomsRepository.findUniqueByParticipants({
			firstSubjectId: userId,
			secondSubjectId: guestId,
		});

		if (room) {
			return success({ room: Room.create({ type: room.type, createdAt: room.createdAt }, room.id) });
		}

		const newRom = Room.create({
			type: 'PRIVATE',
		});

		const userParticipant = Participant.create({
			roomId: newRom.id,
			userId: new UniqueEntityId(userId),
		});

		const guestParticipant = Participant.create({
			roomId: newRom.id,
			userId: new UniqueEntityId(guestId),
		});

		await this.roomsRepository.create(newRom);

		await Promise.all([
			this.participantsRepository.create(userParticipant),
			this.participantsRepository.create(guestParticipant),
		]);

		return success({ room: newRom });
	}
}
