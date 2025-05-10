import { Participant } from '@/domains/chat/models/entities/participant';

export interface IFindUniqueParticipantParams {
	userId: string;
	roomId: string;
}

export interface IParticipantRepository {
	create(participant: Participant): Promise<Participant>;
	update(participant: Participant): Promise<Participant>;
	delete(participant: Participant): Promise<void>;
	findMany(): Promise<Participant[]>;
	findById(id: string): Promise<Participant | null>;
	findUnique(params: IFindUniqueParticipantParams): Promise<Participant | null>;
}
