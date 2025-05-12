import { Attachment } from '@/domains/chat/models/entities/attachment';

export interface IAttachmentRepository {
	create(attachment: Attachment): Promise<Attachment>;
	update(attachment: Attachment): Promise<Attachment>;
	delete(attachment: Attachment): Promise<void>;
	findMany(): Promise<Attachment[]>;
	findManyByRoomId(roomId: string): Promise<Attachment[] | null>;
	findManyByMessageId(messageId: string): Promise<Attachment[] | null>;
	findById(id: string): Promise<Attachment | null>;
}
