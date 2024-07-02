import { log } from "@/utils";
import { Collection } from "@discordjs/collection";
import { NextFunction, Request, Response } from "express";

import z from "zod";

export type Imiddleware = (
  route: IRouter
) => (req: Request, res: Response, next: NextFunction) => any;

export type Iexecute = (req: personalRequest, res: Response) => any;

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

export interface personalRequest extends Request {
  saveFiles: () => { success: false } | { success: true; ids: string[] };

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
  public execute: (req: personalRequest, res: Response) => void;

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
// new Router({
//   path: "user",
//   method: "post",
//   params: { body: z.object({}) },

//   execute(req, res) {
//     req.body;
//   },
// });

// export class Router2 {
//   public static all: Collection<string, typeof Router> = new Collection();

//   public readonly router_id?: string;
//   public path: string;
//   public body: object = {};
//   public method: methods;
//   public middlewares: any[] = [];

//   // private exec: (req: Request, res: Response) => void ;

//   constructor({
//     id,
//     path,
//     method,
//     body,
//   }: {
//     id?: string;
//     path: string;
//     method: methods;
//     body:  z.ZodString;
//   }) {
//     this.router_id = id;
//     this.path = path;
//     this.method = method;
//     this.body = body;
//   }

//   public execute(req: ) {
//     // Implementação do método execute
//     // Exemplo de uso:
//     console.log(req.body); // Aqui você pode acessar req.body com segurança
//   }
// }

// interface IRouterConfig<T extends z.ZodRawShape, Q, P> {
//   query?: Q;
//   body: T;
//   params?: P;
//   execute: (req: Request<P, Q, z.infer<z.ZodObject>>, res: Response) => void;
// }

// function createRoute<B, Q, P>(routerConfig: IRouterConfig<B, Q, P>) {

//   return routerConfig;
// }

// createRoute({
//   body: z.object({ name: z.string().email() }),

//   execute(req, res) {
//     req.body.;
//   },
// });

// // function sla(params ) {
// //   return params.parce;
// // }
