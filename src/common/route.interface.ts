import { Request, Response, NextFunction, Router } from 'express';
import { IMiddleware } from './middlewares/middleware.interface';

export interface IRoute {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete' | 'patch'>;
	middleware?: IMiddleware[];
}
