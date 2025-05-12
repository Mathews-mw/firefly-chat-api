import { container } from 'tsyringe';

import { DependencyIdentifiers } from './dependency-identifiers';

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

function registerSingleton<T>(identifier: DependencyIdentifiers, implementation: new (...args: any[]) => T) {
	container.registerSingleton(identifier, implementation);
}

registerSingleton('UsersRepository', PrismaUsersRepository);
registerSingleton('RoomsRepository', PrismaRoomsRepository);
registerSingleton('AccountsRepository', PrismaAccountsRepository);
registerSingleton('SessionsRepository', PrismaSessionsRepository);
registerSingleton('AttachmentsRepository', PrismaAttachmentsRepository);
registerSingleton('InvitationsRepository', PrismaInvitationsRepository);
registerSingleton('FriendshipsRepository', PrismaFriendshipsRepository);
registerSingleton('ParticipantsRepository', PrismaParticipantsRepository);
registerSingleton('ChatMessagesRepository', PrismaChatMessagesRepository);
registerSingleton('ReadReceiptsRepository', PrismaReadReceiptsRepository);
