/// <reference types="@types/express" />
import { Collection } from "@discordjs/collection";
import { NextFunction, Request, Response } from "express";
import z from "zod";
export type Imiddleware = (route: IRouter) => (req: Request, res: Response, next: NextFunction) => any;
export type Iexecute = (req: personalRequest, res: Response) => any;
export type Ifile = {
    max?: number;
    type: filesTypes;
    size?: number;
    required?: boolean;
    folder: string;
};
export type filesTypes = "image/" | "audio/" | "video/" | "text/plain" | "application/pdf" | "application/msword" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" | "application/zip" | "application/zip" | "application/x-tar" | "application/x-rar-compressed" | "all";
export interface personalRequest extends Request {
    saveFiles: () => {
        success: false;
    } | {
        success: true;
        ids: string[];
    };
    files: Express.Multer.File[];
}
interface IRouterBase {
    path: string;
    method: "get" | "post" | "put" | "patch" | "delete";
    files?: Ifile;
    middlewares?: Imiddleware[];
    execute: Iexecute;
}
export type IRouter = IRouterWithBody | IRouterWithoutBody;
interface IRouterWithoutBody extends IRouterBase {
    method: "get";
    params?: {
        query?: z.ZodObject<any>;
        params?: z.ZodObject<any>;
    };
}
interface IRouterWithBody extends IRouterBase {
    method: "post" | "put" | "patch" | "delete";
    params?: {
        query?: z.ZodObject<any>;
        params?: z.ZodObject<any>;
        body?: z.ZodObject<any>;
    };
}
export declare class Route {
    static all: Collection<string, IRouter & {
        id: string;
    }>;
    readonly id?: string;
    path: string;
    method: "get" | "post" | "put" | "patch" | "delete";
    middlewares: Imiddleware[];
    files: Ifile | undefined;
    params?: {
        body?: z.ZodObject<any>;
        query?: z.ZodObject<any>;
        params?: z.ZodObject<any>;
    };
    execute: (req: personalRequest, res: Response) => void;
    constructor(config: IRouter);
}
export {};
