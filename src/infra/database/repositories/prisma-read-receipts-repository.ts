import { prisma } from '../prisma';
import { ReadReceiptMapper } from '../mappers/chat/read-receipt-mapper';
import { ReadReceipt } from '@/domains/chat/models/entities/read-receipt';
import {
	IFindUniqueParams,
	IReadReceiptRepository,
} from '@/domains/chat/application/features/chat/repositories/read-receipt-repository';

export class PrismaReadReceiptsRepository implements IReadReceiptRepository {
	async create(readReceipt: ReadReceipt) {
		const data = ReadReceiptMapper.toPrisma(readReceipt);

		await prisma.readReceipt.create({
			data,
		});

		return readReceipt;
	}

	async createMany(readReceipts: Array<ReadReceipt>) {
		const data = readReceipts.map(ReadReceiptMapper.toPrisma);

		const result = await prisma.readReceipt.createMany({
			data,
			skipDuplicates: true,
		});

		return result.count;
	}

	async update(readReceipt: ReadReceipt) {
		const data = ReadReceiptMapper.toPrisma(readReceipt);

		await prisma.readReceipt.update({
			data,
			where: {
				messageId_userId: {
					messageId: data.messageId,
					userId: data.userId,
				},
			},
		});

		return readReceipt;
	}

	async delete(readReceipt: ReadReceipt) {
		await prisma.readReceipt.delete({
			where: {
				messageId_userId: {
					messageId: readReceipt.messageId.toString(),
					userId: readReceipt.userId.toString(),
				},
			},
		});
	}

	async findMany(): Promise<ReadReceipt[]> {
		const readReceipt = await prisma.readReceipt.findMany();

		return readReceipt.map(ReadReceiptMapper.toDomain);
	}

	async findUnique({ userId, messageId }: IFindUniqueParams) {
		const readReceipt = await prisma.readReceipt.findUnique({
			where: {
				messageId_userId: {
					messageId,
					userId,
				},
			},
		});

		if (!readReceipt) {
			return null;
		}

		return ReadReceiptMapper.toDomain(readReceipt);
	}
}
