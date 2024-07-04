import { log } from "@/utils";
import { Collection } from "@discordjs/collection";
import { NextFunction, Request, Response } from "express";
import { Readable } from "stream";

import z from "zod";

export type Imiddleware = (
  route: IRouter
) => (req: Request, res: Response, next: NextFunction) => any;

export type Iexecute = (req: personalRequest, res: IResponsePersonal) => any;

export type Ifile = {
  max?: number;
  type: filesTypes;
  size?: number;
  required?: boolean;
  folder: string;
};

export type filesTypes =
  | "image/"
  | "audio/"
  | "video/"
  | "text/plain"
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "application/zip"
  | "application/zip"
  | "application/x-tar"
  | "application/x-rar-compressed"
  | "all";

export type personalRequest = Request & {
  saveFiles: () => { success: false } | { success: true; ids: string[] };

  files: IFile[];
};

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

export type IResponsePersonal = Response & {
  success: (json?: object) => void;
  reject: (text: string, json?: object) => void;
};

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

export class Route {
  public static all: Collection<string, IRouter & { id: string }> =
    new Collection();

  public readonly id?: string;
  public path: string;
  public method: "get" | "post" | "put" | "patch" | "delete";
  public middlewares: Imiddleware[];

  public files: Ifile | undefined;

  public params?: {
    body?: z.ZodObject<any>;
    query?: z.ZodObject<any>;
    params?: z.ZodObject<any>;
  };
  public execute: (req: personalRequest, res: IResponsePersonal) => void;

  constructor(config: IRouter) {
    const { path, params, method, middlewares = [], files, execute } = config;

    this.id = `${path}-${method.toUpperCase()}`;
    this.path = path.startsWith("/") ? path : `/${path}`;
    this.method = method;
    this.params = params;
    this.middlewares = middlewares;
    this.files = files;

    this.execute = execute;

    const routerExist = Route.all.has(this.id);

    if (routerExist) {
      log.error(`Route ${this.id} already exists`);
      process.exit(1);
    }

    Route.all.set(this.id, {
      id: this.id,
      path: this.path,
      method: this.method,
      params: this.params,
      middlewares: this.middlewares,
      files: this.files,
      execute: this.execute,
    });
  }
}
