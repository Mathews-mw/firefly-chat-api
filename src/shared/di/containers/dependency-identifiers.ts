export const DEPENDENCY_IDENTIFIERS = {
	ACCOUNTS_REPOSITORY: 'AccountsRepository',
	CHAT_MESSAGES_REPOSITORY: 'ChatMessagesRepository',
	FRIENDSHIPS_REPOSITORY: 'FriendshipsRepository',
	INVITATIONS_REPOSITORY: 'InvitationsRepository',
	PARTICIPANTS_REPOSITORY: 'ParticipantsRepository',
	ROOMS_REPOSITORY: 'RoomsRepository',
	SESSIONS_REPOSITORY: 'SessionsRepository',
	USERS_REPOSITORY: 'UsersRepository',
	READ_RECEIPTS_REPOSITORY: 'ReadReceiptsRepository',
} as const;

export type DependencyIdentifiers = (typeof DEPENDENCY_IDENTIFIERS)[keyof typeof DEPENDENCY_IDENTIFIERS];
