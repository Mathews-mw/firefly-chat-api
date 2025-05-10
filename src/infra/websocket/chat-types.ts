export interface WSChatMessage {
	id: string;
	roomId: string;
	senderId: string;
	content: string;
	createdAt: string;
	author: {
		id: string;
		name: string;
		avatarUrl?: string | null;
	};
}

export interface IClientToServerEvents {
	joinRoom: { roomId: string };
	leaveRoom: { roomId: string };
	markAsRead: { roomId: string; messageIds: Array<string> };
	sendMessage: { roomId: string; content: string };
}

export interface IServerToClientEvents {
	message: { roomId: string; message: WSChatMessage };
	userJoined: { roomId: string; userId: string };
	userLeft: { roomId: string; userId: string };
	messageRead: { roomId: string; userId: string; messageIds: Array<string> };
}
