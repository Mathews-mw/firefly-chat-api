import { ReadReceipt } from '@/domains/chat/models/entities/read-receipt';
import { ReadReceiptResponseSchema } from '../../schemas/chat/read-receipt-schema';

export class ReadReceiptPresenter {
	static toHTTP(data: ReadReceipt): ReadReceiptResponseSchema {
		return {
			user_id: data.userId.toString(),
			message_id: data.messageId.toString(),
			read_at: data.readAt,
		};
	}
}
