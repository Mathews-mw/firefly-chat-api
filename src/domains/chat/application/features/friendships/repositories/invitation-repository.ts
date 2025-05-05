import { IInvitationStatus, Invitation } from '@/domains/chat/models/entities/invitation';

export interface IFindManyBySenderQuery {
	senderId: string;
	status?: IInvitationStatus;
}

export interface IFindManyByReceiverQuery {
	receiverId: string;
	status?: IInvitationStatus;
}

export interface IFindUniqueQuery {
	senderId: string;
	receiverId: string;
}

export interface IInvitationRepository {
	create(invitation: Invitation): Promise<Invitation>;
	update(invitation: Invitation): Promise<Invitation>;
	delete(invitation: Invitation): Promise<void>;
	findManyBySenderId(query: IFindManyBySenderQuery): Promise<Invitation[]>;
	findManyByReceiverId(query: IFindManyByReceiverQuery): Promise<Invitation[]>;
	findById(id: string): Promise<Invitation | null>;
	findUnique(params: IFindUniqueQuery): Promise<Invitation | null>;
}
