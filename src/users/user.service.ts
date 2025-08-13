import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';
import { injectable } from 'inversify';

@injectable()
export class UserService implements IUserService {
	async createUser(dto: UserRegisterDto): Promise<User | null> {
		const user = new User(dto.email, dto.name);

		await user.setPassword(dto.password);

		return user;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
