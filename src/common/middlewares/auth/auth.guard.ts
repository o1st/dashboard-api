import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from '../middleware.interface';
import { HTTPException } from '../../../errors/http-error.class';

export class AuthGuard implements IMiddleware {
	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (req.user) {
			return next();
		}

		return next(new HTTPException('Unauthorized', 401));
	}
}
