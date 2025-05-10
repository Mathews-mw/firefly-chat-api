import { ReadReceipt } from '@/domains/chat/models/entities/read-receipt';

export interface IFindUniqueParams {
	userId: string;
	messageId: string;
}

export interface IReadReceiptRepository {
	create(readReceipt: ReadReceipt): Promise<ReadReceipt>;
	createMany(readReceipts: Array<ReadReceipt>): Promise<number>;
	update(readReceipt: ReadReceipt): Promise<ReadReceipt>;
	delete(readReceipt: ReadReceipt): Promise<void>;
	findMany(): Promise<ReadReceipt[]>;
	findUnique(params: IFindUniqueParams): Promise<ReadReceipt | null>;
}
