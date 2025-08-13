import { Router, Response } from 'express';
import { IRoute } from './route.interface';
import { injectable } from 'inversify';
import { ILogger } from '../logger/logger.service.interface';
import 'reflect-metadata';
@injectable()
export abstract class BaseController {
	private readonly _router: Router;
	private logger: ILogger;

	constructor(logger: ILogger) {
		this._router = Router();
		this.logger = logger;
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): Response {
		res.type('application/json');

		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): Response {
		return this.send(res, 200, message);
	}

	public created(res: Response): Response {
		return res.sendStatus(201);
	}

	protected bindRoutes(routes: IRoute[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);

			const middleware = route.middleware?.map((mw) => mw.execute.bind(mw)) || [];
			const handler = route.func.bind(this);
			const pipeline = [...middleware, handler];

			this._router[route.method](route.path, pipeline);
		}
	}
}
