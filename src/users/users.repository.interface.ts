import { UserModel } from '@prisma/client';
import { User } from './user.entity';

export interface IUsersRepository {
	create: (data: User) => Promise<UserModel>;
	find: (email: string) => Promise<UserModel | null>;
}
