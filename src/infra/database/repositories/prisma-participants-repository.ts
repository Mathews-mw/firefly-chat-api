import { prisma } from '../prisma';
import { ParticipantMapper } from '../mappers/chat/participant-mapper';
import { Participant } from '@/domains/chat/models/entities/participant';
import {
	IFindUniqueParticipantParams,
	IParticipantRepository,
} from '@/domains/chat/application/features/chat/repositories/participant-repository';

export class PrismaParticipantsRepository implements IParticipantRepository {
	async create(participant: Participant) {
		const data = ParticipantMapper.toPrisma(participant);

		await prisma.participant.create({
			data,
		});

		return participant;
	}

	async update(participant: Participant) {
		const data = ParticipantMapper.toPrisma(participant);

		await prisma.participant.update({
			data,
			where: {
				id: data.id,
			},
		});

		return participant;
	}

	async delete(participant: Participant) {
		await prisma.participant.delete({
			where: {
				id: participant.id.toString(),
			},
		});
	}

	async findMany(): Promise<Participant[]> {
		const participants = await prisma.participant.findMany();

		return participants.map(ParticipantMapper.toDomain);
	}

	async findById(id: string) {
		const participant = await prisma.participant.findUnique({
			where: {
				id,
			},
		});

		if (!participant) {
			return null;
		}

		return ParticipantMapper.toDomain(participant);
	}

	async findUnique({ userId, roomId }: IFindUniqueParticipantParams) {
		const participant = await prisma.participant.findUnique({
			where: {
				roomId_userId: {
					userId,
					roomId,
				},
			},
		});

		if (!participant) {
			return null;
		}

		return ParticipantMapper.toDomain(participant);
	}
}
