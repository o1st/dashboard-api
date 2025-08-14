import { BaseController } from '../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { IUsersController } from './users.controller.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { IUserService } from './services/user.service.interface';
import { HTTPException } from '../errors/http-error.class';
import { ValidateMiddleware } from '../common/middlewares/validate/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { AuthGuard } from '../common/middlewares/auth/auth.guard';

@injectable()
export class UserController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.Logger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
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
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middleware: [new AuthGuard()],
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

		this.ok(res, { email: user.email, id: user.id });
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

		const token = await this.signJWT(body.email, this.configService.get('SECRET'));

		this.ok(res, { token });
	}

	public async info(
		{ user }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user.email);

		if (!userInfo) {
			return next(new HTTPException('User not found', 404));
		}

		this.ok(res, userInfo);
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise((resolve, reject) => {
			const payload = { email };

			sign(payload, secret, { expiresIn: '1h' }, (err, token) => {
				if (err) {
					return reject(err);
				}
				resolve(token);
			});
		});
	}
}
