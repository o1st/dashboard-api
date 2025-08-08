import { BaseController } from "../common/base.controller";
import { NextFunction, Request, Response } from "express";
import { IUsersController } from "./users.controller.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.service.interface";
import "reflect-metadata";

@injectable()
export class UserController extends BaseController implements IUsersController {
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger
    ) {
        super(loggerService);

        this.bindRoutes([
            { path: '/register', method: 'post', func: this.register },
            { path: '/login', method: 'post', func: this.login },
        ]);
    }

    public register(req: Request, res: Response, next: NextFunction): void {
        this.ok(res, 'register');
    }

    public login(req: Request, res: Response, next: NextFunction): void {
        this.ok(res, 'login');
    }
}