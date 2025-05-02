import { ChatMessage } from './chat-types';

export class ChatUseCase {
	async execute(roomId: string, senderId: string, content: string): Promise<ChatMessage> {
		console.log('roomId: ', roomId);
		console.log('senderId: ', senderId);
		console.log('content: ', content);

		return {
			id: 'created id',
			roomId: roomId,
			senderId: senderId,
			content: content,
			createdAt: new Date().toISOString(),
		};
	}
}
