import express, { Express } from 'express';
import { Server } from 'http';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/logger.service.interface';
import { IUsersController } from './users/users.controller.interface';
import 'reflect-metadata';
import { json } from 'body-parser';
import { PrismaService } from './database/prisma.service';

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
	) {
		this.app = express();
		this.port = 8000;
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useMiddleware(): void {
		this.app.use(json());
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
