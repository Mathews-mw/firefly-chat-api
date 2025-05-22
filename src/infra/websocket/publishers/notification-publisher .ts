import { injectable } from 'tsyringe';
import * as WebSocket from '@fastify/websocket';

import { NotificationDetails } from '@/domains/notification/models/value-objects/notification-details';
import { NotificationDetailsPresenter } from '@/infra/http/presenters/notifications/notification-details-presenter';

interface IPayload {
	notification: NotificationDetails<{ title: string; content: string; metadata?: {} | null }>;
}

@injectable()
export class NotificationPublisher {
	private activeSockets = new Map<string, WebSocket.WebSocket>();

	registerSocket(userId: string, socket: WebSocket.WebSocket) {
		this.activeSockets.set(userId, socket);
	}

	removeSocket(userId: string) {
		this.activeSockets.delete(userId);
	}

	publishTo(userId: string, payload: IPayload) {
		const sock = this.activeSockets.get(userId);

		const response = NotificationDetailsPresenter.toHTTP(payload.notification);

		if (sock) {
			sock.send(JSON.stringify({ event: 'newNotification', payload: { notification: response } }));
		}
	}
}
