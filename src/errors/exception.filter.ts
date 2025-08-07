import { NextFunction, Request, Response } from "express";
import { LoggerService } from "../logger/logger.service";
import { IExceptionFilter } from "./exception.filter.interface";
import { HTTPException } from "./http-error.class";

export class ExceptionFilter implements IExceptionFilter {
    logger: LoggerService<unknown>;

    constructor(logger: LoggerService<unknown>) {
        this.logger = logger;
    }

    catch(err: Error | HTTPException, req: Request, res: Response, next: NextFunction) {
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