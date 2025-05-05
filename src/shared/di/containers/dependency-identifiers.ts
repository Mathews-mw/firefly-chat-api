export const DEPENDENCY_IDENTIFIERS = {
	USERS_REPOSITORY: 'UsersRepository',
	ACCOUNTS_REPOSITORY: 'AccountsRepository',
	SESSIONS_REPOSITORY: 'SessionsRepository',
	INVITATIONS_REPOSITORY: 'InvitationsRepository',
	FRIENDSHIPS_REPOSITORY: 'FriendshipsRepository',
} as const;

export type DependencyIdentifiers = (typeof DEPENDENCY_IDENTIFIERS)[keyof typeof DEPENDENCY_IDENTIFIERS];
