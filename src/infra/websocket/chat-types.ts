import { AttachmentType } from '@/domains/chat/models/entities/attachment';

export interface WSChatMessage {
	id: string;
	roomId: string;
	senderId: string;
	content: string;
	isDeleted: boolean;
	createdAt: string;
	author: {
		id: string;
		name: string;
		avatarUrl?: string | null;
	};
	attachments?: Array<{
		id: string;
		title: string;
		url: string;
		type: AttachmentType;
	}>;
}

export interface IClientToServerEvents {
	joinRoom: { roomId: string };
	leaveRoom: { roomId: string };
	markAsRead: { roomId: string; messageIds: Array<string> };
	sendMessage: { roomId: string; content: string };
	sendAttachmentMessage: { roomId: string; attachmentIds: Array<string> };
	editMessage: { roomId: string; messageId: string; content: string };
	deleteMessage: { roomId: string; messageId: string };
}

export interface IServerToClientEvents {
	message: { roomId: string; message: WSChatMessage };
	userJoined: { roomId: string; userId: string };
	userLeft: { roomId: string; userId: string };
	messageRead: { roomId: string; readerId: string; messageIds: Array<string> };
	messageEdited: { roomId: string; message: WSChatMessage };
	messageDeleted: { roomId: string; messageId: string };
}
