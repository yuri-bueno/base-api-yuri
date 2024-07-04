/// <reference types="@types/express" />
/// <reference types="node" />
/// <reference types="node" />
import { Collection } from "@discordjs/collection";
import { NextFunction, Request, Response } from "express";
import { Readable } from "stream";
import z from "zod";
export type Imiddleware = (route: IRouter) => (req: Request, res: Response, next: NextFunction) => any;
export type Iexecute = (req: personalRequest, res: IResponsePersonal) => any;
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
    files: IFile[];
}
export interface IFile {
    /** Name of the form field associated with this file. */
    fieldname: string;
    /** Name of the file on the uploader's computer. */
    originalname: string;
    /**
     * Value of the `Content-Transfer-Encoding` header for this file.
     * @deprecated since July 2015
     * @see RFC 7578, Section 4.7
     */
    encoding: string;
    /** Value of the `Content-Type` header for this file. */
    mimetype: string;
    /** Size of the file in bytes. */
    size: number;
    /**
     * A readable stream of this file. Only available to the `_handleFile`
     * callback for custom `StorageEngine`s.
     */
    stream: Readable;
    /** `DiskStorage` only: Directory to which this file has been uploaded. */
    destination: string;
    /** `DiskStorage` only: Name of this file within `destination`. */
    filename: string;
    /** `DiskStorage` only: Full path to the uploaded file. */
    path: string;
    /** `MemoryStorage` only: A Buffer containing the entire file. */
    buffer: Buffer;
}
export interface IResponsePersonal extends Response {
    success: (json?: object) => void;
    reject: (text: string, json?: object) => void;
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
    execute: (req: personalRequest, res: IResponsePersonal) => void;
    constructor(config: IRouter);
}
export {};
