import { container } from 'tsyringe';

import { DependencyIdentifiers } from './dependency-identifiers';

import { PrismaUsersRepository } from '@/infra/database/repositories/prisma-users-repository';
import { PrismaFriendshipsRepository } from '@/infra/database/repositories/friendships-repository';
import { PrismaSessionsRepository } from '@/infra/database/repositories/prisma-sessions-repository';
import { PrismaAccountsRepository } from '@/infra/database/repositories/prisma-accounts-repository';
import { PrismaInvitationsRepository } from '@/infra/database/repositories/prisma-invitations-repository';

function registerSingleton<T>(identifier: DependencyIdentifiers, implementation: new (...args: any[]) => T) {
	container.registerSingleton(identifier, implementation);
}

registerSingleton('UsersRepository', PrismaUsersRepository);
registerSingleton('AccountsRepository', PrismaAccountsRepository);
registerSingleton('SessionsRepository', PrismaSessionsRepository);
registerSingleton('InvitationsRepository', PrismaInvitationsRepository);
registerSingleton('FriendshipsRepository', PrismaFriendshipsRepository);
