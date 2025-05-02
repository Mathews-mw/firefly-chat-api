export interface ClientToServerEvents {
	joinRoom: { roomId: string };
	leaveRoom: { roomId: string };
	sendMessage: { roomId: string; content: string };
}

export interface ServerToClientEvents {
	message: { roomId: string; message: ChatMessage };
	userJoined: { roomId: string; userId: string };
	userLeft: { roomId: string; userId: string };
}

export interface ChatMessage {
	id: string;
	roomId: string;
	senderId: string;
	content: string;
	createdAt: string;
}
