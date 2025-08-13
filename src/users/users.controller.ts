import { BaseController } from '../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { IUsersController } from './users.controller.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.service.interface';
import 'reflect-metadata';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { IUserService } from './user.service.interface';
import { HTTPException } from '../errors/http-error.class';
import { ValidateMiddleware } from '../common/validate.middleware';

@injectable()
export class UserController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.Logger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
	) {
		super(loggerService);

		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middleware: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middleware: [new ValidateMiddleware(UserLoginDto)],
			},
		]);
	}

	public async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const user = await this.userService.createUser(body);

		if (!user) {
			return next(new HTTPException('User already exists', 409));
		}

		this.ok(res, { email: user.email });
	}

	public async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const isValid = await this.userService.validateUser(body);
		if (!isValid) {
			return next(new HTTPException('Invalid email or password', 401));
		}

		this.ok(res, isValid);
	}
}
