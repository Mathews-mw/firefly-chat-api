export const DEPENDENCY_IDENTIFIERS = {
	USERS_REPOSITORY: 'UsersRepository',
	ACCOUNTS_REPOSITORY: 'AccountsRepository',
	SESSIONS_REPOSITORY: 'SessionsRepository',
} as const;

export type DependencyIdentifiers = (typeof DEPENDENCY_IDENTIFIERS)[keyof typeof DEPENDENCY_IDENTIFIERS];
