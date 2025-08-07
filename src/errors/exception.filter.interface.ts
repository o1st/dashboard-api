import { NextFunction, Request, Response } from "express";
import { HTTPException } from "./http-error.class";

export interface IExceptionFilter {
    catch: (err: Error | HTTPException, req: Request, res: Response, next: NextFunction) => void;
}