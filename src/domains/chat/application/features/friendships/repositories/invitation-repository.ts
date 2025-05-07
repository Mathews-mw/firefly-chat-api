import { IInvitationStatus, Invitation } from '@/domains/chat/models/entities/invitation';
import { InvitationWithSender } from '@/domains/chat/models/entities/value-objects/invitation-with-sender';
import { InvitationWithReceiver } from '@/domains/chat/models/entities/value-objects/invitation-with-receiver';

export interface IFindManyBySenderQuery {
	senderId: string;
	status?: IInvitationStatus;
}

export interface IFindManyByReceiverQuery {
	receiverId: string;
	status?: IInvitationStatus;
}

export interface IInvitationsAmountQuery {
	senderId?: string;
	receiverId?: string;
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
	findManyBySenderId(query: IFindManyBySenderQuery): Promise<InvitationWithReceiver[]>;
	findManyByReceiverId(query: IFindManyByReceiverQuery): Promise<InvitationWithSender[]>;
	invitationsAmount(query: IInvitationsAmountQuery): Promise<number>;
	findById(id: string): Promise<Invitation | null>;
	findUnique(params: IFindUniqueQuery): Promise<Invitation | null>;
}
