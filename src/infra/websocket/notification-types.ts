export interface IClientToServerEvents {
	invitation: { recipientId: string };
}

export interface IServerToClientEvents {
	newNotification: { notificationId: string };
}

type Test = IServerToClientEvents['newNotification'];
