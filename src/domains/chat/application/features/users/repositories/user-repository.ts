import { User } from '@/domains/chat/models/entities/user';

export interface IUserQuerySearch {
	search?: string;
}

export interface IFindUniqueParams {
	id?: string;
	email?: string;
	username?: string;
}

export interface IUserRepository {
	create(user: User): Promise<User>;
	update(user: User): Promise<User>;
	delete(user: User): Promise<void>;
	findMany(query: IUserQuerySearch): Promise<User[]>;
	findById(id: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
	findUnique(params: IFindUniqueParams): Promise<User | null>;
}
