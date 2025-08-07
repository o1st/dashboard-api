import express, {Express} from 'express';
import {Server} from 'http';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/users.controller';
import { IExceptionFilter } from './errors/exception.filter.interface';

export class App {
    app: Express;
    server: Server;
    port: number;
    logger: LoggerService<unknown>;
    userController: UserController;
    exceptionFilter: IExceptionFilter;

    constructor(logger: LoggerService<unknown>, userController: UserController, exceptionFilter: IExceptionFilter) {
        this.app = express();
        this.port = 8000;
        this.logger = logger;
        this.userController = userController;
        this.exceptionFilter = exceptionFilter;
    }

    useRoutes() {
        this.app.use('/users', this.userController.router);
    }

    useExceptionFilters() {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }

    public async init() {
        this.useRoutes();
        this.useExceptionFilters();
        this.server = this.app.listen(this.port);

        this.logger.log(`Server started on port ${this.port}`);
    }
}