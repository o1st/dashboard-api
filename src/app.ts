import express, { Express } from 'express';
import { Server } from 'http';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/logger.service.interface';
import { IUsersController } from './users/users.controller.interface';
import { json } from 'body-parser';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/middlewares/auth/auth.middleware';
import { IConfigService } from './config/config.service.interface';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.Logger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: IUsersController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		this.app = express();
		this.port = 8000;
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useMiddleware(): void {
		this.app.use(json());

		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();

		await this.prismaService.connect();

		this.server = this.app.listen(this.port);

		this.logger.log(`Server started on port ${this.port}`);
	}
}
