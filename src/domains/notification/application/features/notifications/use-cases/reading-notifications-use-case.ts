import { injectable } from 'tsyringe';

import { prisma } from '@/infra/database/prisma';
import { Outcome, success } from '@/core/outcome';

interface IRequest {
	notificationIds: Array<string>;
	userId: string;
}

type Response = Outcome<null, null>;

@injectable()
export class ReadingNotificationsUseCase {
	async execute({ notificationIds, userId }: IRequest): Promise<Response> {
		await prisma.notification.updateMany({
			data: {
				isRead: true,
			},
			where: {
				recipientId: userId,
				id: {
					in: notificationIds,
				},
			},
		});

		return success(null);
	}
}
