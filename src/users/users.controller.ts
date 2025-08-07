import { BaseController } from "../common/base.controller";
import { HTTPException } from "../errors/http-error.class";
import { LoggerService } from "../logger/logger.service";
import { NextFunction, Request, Response } from "express";

export class UserController extends BaseController {
    constructor(logger: LoggerService<unknown>) {
        super(logger);

        this.bindRoutes([
            {path: '/register', method: 'post', func: this.register},
            {path: '/login', method: 'post', func: this.login},
        ]);
    }

    private register(req: Request, res: Response, next: NextFunction) {
        this.ok(res, 'register');
    }

    private login(req: Request, res: Response, next: NextFunction) {
        this.ok(res, 'login');
    }

}