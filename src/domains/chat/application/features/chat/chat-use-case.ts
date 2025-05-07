import { randomUUID } from 'node:crypto';
import { ChatMessage } from './chat-types';

export class ChatUseCase {
	async execute(roomId: string, senderId: string, content: string): Promise<ChatMessage> {
		console.log('use case roomId: ', roomId);
		console.log('use case senderId: ', senderId);
		console.log('use case content: ', content);

		return {
			id: randomUUID(),
			roomId: roomId,
			senderId: senderId,
			content: content,
			createdAt: new Date().toISOString(),
		};
	}
}
