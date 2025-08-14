import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../../config/config.service.interface';
import { IUserService } from './user.service.interface';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { UserService } from './user.service';
import { TYPES } from '../../types';
import { UserRegisterDto } from '../dto/user-register.dto';
import { UserLoginDto } from '../dto/user-login.dto';
import { hash } from 'bcryptjs';
import { UserModel } from '@prisma/client';

const createdUser: UserModel = {
	email: 'a@example.com',
	name: 'User',
	password: 'hash',
	id: 1,
	createdAt: new Date(),
	updatedAt: new Date(),
};

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	create: jest.fn(),
	find: jest.fn(),
};

const container = new Container();

let configService: IConfigService;
let usersRepository: IUsersRepository;
let userService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	userService = container.get<IUserService>(TYPES.UserService);
});

afterEach(() => {
	jest.clearAllMocks();
});

describe('UserService', () => {
	test('createUser returns null if user already exists', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.find = jest.fn().mockResolvedValueOnce(createdUser);

		const dto: UserRegisterDto = { email: 'a@example.com', name: 'User', password: 'pass' };
		const result = await userService.createUser(dto);

		expect(result).toBeNull();
		expect(usersRepository.find).toHaveBeenCalledWith('a@example.com');
		expect(usersRepository.create).not.toHaveBeenCalled();
	});

	test('createUser returns user if created successfully', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.find = jest.fn().mockResolvedValueOnce(null);
		usersRepository.create = jest.fn().mockResolvedValueOnce({
			email: 'b@example.com',
			name: 'User B',
			password: 'hash2',
			id: 2,
		});

		const dto: UserRegisterDto = { email: 'b@example.com', name: 'User B', password: 'pass2' };
		const result = await userService.createUser(dto);

		expect(result).toEqual({
			email: 'b@example.com',
			name: 'User B',
			password: expect.any(String),
			id: 2,
		});
		expect(usersRepository.find).toHaveBeenCalledWith('b@example.com');
		expect(usersRepository.create).toHaveBeenCalled();
	});

	test('validateUser returns true for valid credentials', async () => {
		const passwordHash = await hash(createdUser.password, 1);
		usersRepository.find = jest
			.fn()
			.mockResolvedValueOnce({ ...createdUser, password: passwordHash });

		const dto: UserLoginDto = { email: 'a@example.com', password: createdUser.password };
		const result = await userService.validateUser(dto);

		expect(result).toBeTruthy();
		expect(usersRepository.find).toHaveBeenCalledWith('a@example.com');
	});

	test('validateUser returns false for invalid credentials', async () => {
		usersRepository.find = jest.fn().mockResolvedValueOnce(null);

		const dto: UserLoginDto = { email: 'a@example.com', password: 'wrongpass' };
		const result = await userService.validateUser(dto);

		expect(result).toBeFalsy();
		expect(usersRepository.find).toHaveBeenCalledWith('a@example.com');
	});
});
