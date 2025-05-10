import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ReadReceipt } from '@/domains/chat/models/entities/read-receipt';
import { ReadReceipt as PrismaReadReceipt } from 'prisma/generated/client';

export class ReadReceiptMapper {
	static toDomain(data: PrismaReadReceipt): ReadReceipt {
		return ReadReceipt.create({
			userId: new UniqueEntityId(data.userId),
			messageId: new UniqueEntityId(data.messageId),
			readAt: data.readAt,
		});
	}

	static toPrisma(data: ReadReceipt): PrismaReadReceipt {
		return {
			userId: data.userId.toString(),
			messageId: data.messageId.toString(),
			readAt: data.readAt,
		};
	}
}
