import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from '../middleware.interface';
import { verify } from 'jsonwebtoken';
import { HTTPException } from '../../../errors/http-error.class';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];

			verify(token, this.secret, (err, payload) => {
				if (err) {
					next();
				} else if (payload) {
					req.user = payload.email;
					next();
				}
			});
		} else {
			next();
		}
	}
}
