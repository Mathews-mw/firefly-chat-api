import { container } from 'tsyringe';

import { DependencyIdentifiers } from './dependency-identifiers';

import { EventBus } from '@/core/events/event-bus';
import { NotificationPublisher } from '@/infra/websocket/publishers/notification-publisher ';
import { PrismaUsersRepository } from '@/infra/database/repositories/prisma-users-repository';
import { PrismaRoomsRepository } from '@/infra/database/repositories/prisma-rooms-repository';
import { PrismaSessionsRepository } from '@/infra/database/repositories/prisma-sessions-repository';
import { PrismaAccountsRepository } from '@/infra/database/repositories/prisma-accounts-repository';
import { PrismaAttachmentsRepository } from '@/infra/database/repositories/prisma-attachments-repository';
import { PrismaFriendshipsRepository } from '@/infra/database/repositories/prisma-friendships-repository';
import { PrismaInvitationsRepository } from '@/infra/database/repositories/prisma-invitations-repository';
import { PrismaParticipantsRepository } from '@/infra/database/repositories/prisma-participants-repository';
import { PrismaChatMessagesRepository } from '@/infra/database/repositories/prisma-chat-messages-repository';
import { PrismaReadReceiptsRepository } from '@/infra/database/repositories/prisma-read-receipts-repository';
import { PrismaNotificationsRepository } from '@/infra/database/repositories/prisma-notifications-repository';

function registerSingleton<T>(identifier: DependencyIdentifiers, implementation: new (...args: any[]) => T) {
	container.registerSingleton(identifier, implementation);
}

registerSingleton('EventBus', EventBus);

registerSingleton('UsersRepository', PrismaUsersRepository);
registerSingleton('RoomsRepository', PrismaRoomsRepository);
registerSingleton('AccountsRepository', PrismaAccountsRepository);
registerSingleton('SessionsRepository', PrismaSessionsRepository);
registerSingleton('NotificationPublisher', NotificationPublisher);
registerSingleton('AttachmentsRepository', PrismaAttachmentsRepository);
registerSingleton('InvitationsRepository', PrismaInvitationsRepository);
registerSingleton('FriendshipsRepository', PrismaFriendshipsRepository);
registerSingleton('ParticipantsRepository', PrismaParticipantsRepository);
registerSingleton('ChatMessagesRepository', PrismaChatMessagesRepository);
registerSingleton('ReadReceiptsRepository', PrismaReadReceiptsRepository);
registerSingleton('NotificationsRepository', PrismaNotificationsRepository);
