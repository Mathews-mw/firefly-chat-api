import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ParticipantWithUserMapper } from './participant-with-user';
import { AttachmentMapper } from '../attachment/attachment-mapper';
import { RoomDetails } from '@/domains/chat/models/entities/value-objects/room-details';
import {
	Attachment as PrismaAttachment,
	Participant as PrismaParticipant,
	Room as PrismaRoom,
	User as PrismaUser,
} from 'prisma/generated/client';

export type IPrismaParticipantWithUser = PrismaParticipant & {
	user: PrismaUser;
};

export type IPrismaRoomDetails = PrismaRoom & {
	participants: Array<IPrismaParticipantWithUser>;
	attachments: Array<PrismaAttachment>;
};

export class RoomDetailsMapper {
	static toDomain(data: IPrismaRoomDetails): RoomDetails {
		return RoomDetails.create({
			id: new UniqueEntityId(data.id),
			type: data.type,
			name: data.name,
			description: data.description,
			imageUrl: data.imageUrl,
			ownerId: data.ownerId ? new UniqueEntityId(data.ownerId) : null,
			createdAt: data.createdAt,
			participants: data.participants.map(ParticipantWithUserMapper.toDomain),
			attachments: data.attachments.map(AttachmentMapper.toDomain),
		});
	}
}
