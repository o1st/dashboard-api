import { IConfigService } from '../../config/config.service.interface';
import { TYPES } from '../../types';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';
import { User } from '../entities/user.entity';
import { IUserService } from './user.service.interface';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { UserModel } from '@prisma/client';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
	) {}

	async createUser(dto: UserRegisterDto): Promise<UserModel | null> {
		const user = new User(dto.email, dto.name);
		const salt = this.configService.get('SALT');

		await user.setPassword(dto.password, Number(salt));

		const existingUser = await this.usersRepository.find(user.email);
		if (existingUser) {
			return null;
		}

		return this.usersRepository.create(user);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existingUser = await this.usersRepository.find(email);

		if (existingUser === null) {
			return false;
		}

		const user = new User(existingUser.email, existingUser.name, existingUser.password);

		return user.comparePassword(password);
	}
}
