import { Router, Response } from "express";
import { LoggerService } from "../logger/logger.service";
import { IRoute } from "./route.interface";

export abstract class BaseController {
    private readonly _router: Router;
    private logger: LoggerService<unknown>

    constructor(logger: LoggerService<unknown>) {
        this._router = Router();
        this.logger = logger;
    }

    get router() {
        return this._router;
    }

    public send<T>(res: Response, code: number, message: T) {
        res.type("application/json");

        return res.status(code).json(message);
    }

    public ok<T>(res: Response, message: T) {
        return this.send(res, 200, message);
    }

    public created(res: Response) {
        return res.sendStatus(201);
    }

    protected bindRoutes(routes: IRoute[]) {
        for(const route of routes) {
          this.logger.log(`[${route.method}] ${route.path}`);
          const handler = route.func.bind(this);
          this._router[route.method](route.path, handler);
        }
    }
}