import { NextFunction, Request, Response } from "express";
export declare class ErrorHandler extends Error {
    statusCode: number;
    json: object;
    constructor({ message, status, json, }: {
        message: string;
        status: number;
        json?: object;
    });
}
export declare function errorHandler(err: ErrorHandler, req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>>;
