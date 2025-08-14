import { NextFunction, Request, Response } from 'express';
import { IExceptionFilter } from './exception.filter.interface';
import { HTTPException } from './http-error.class';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.service.interface';
import { TYPES } from '../types';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.Logger) private logger: ILogger) {}

	catch(err: Error | HTTPException, req: Request, res: Response, next: NextFunction): void {
		this.logger.error(err);

		if (err instanceof HTTPException) {
			this.logger.error(`[${err.context}] Error ${err.statusCode}: ${err.message}`);

			res.status(err.statusCode).send({ err: err.message });
		} else {
			this.logger.error(`Error: ${err.message}`);
			res.status(500).send({ err: err.message });
		}
	}
}
