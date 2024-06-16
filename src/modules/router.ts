import { log } from "@/utils";

import { Collection } from "@discordjs/collection";
import { Imiddleware } from "./core";

export interface InewRouterGet {
  id?: string;
  path: string;
  method: "get";

  params?: {
    query?: { [key: string]: Iparams };
    params?: { [key: string]: Iparams };
  };
  middlewares?: Imiddleware[];
  execute: (req: Request, res: Response) => void;
}

export interface InewRouterAllmethods {
  id?: string;
  path: string;
  method: "post" | "put" | "patch" | "delete";

  params?: {
    query?: { [key: string]: Iparams };
    body?: { [key: string]: Iparams };
    params?: { [key: string]: Iparams };
  };
  middlewares?: Imiddleware[];
  execute: (req: Request, res: Response) => void;
}
declare type InewRouter = InewRouterGet | InewRouterAllmethods;

export type Iparams =
  | IBooleanParams
  | IStringParams
  | INumberParams
  | IArrayParams;

interface IStringParams {
  type: "string";
  max?: number;
  min?: number;
  regex?: RegExp;

  required?: boolean;
}
interface IArrayParams {
  type: "array";
  required?: boolean;
}

interface INumberParams {
  type: "number";
  max?: number;
  min?: number;

  required?: boolean;
}

interface IBooleanParams {
  type: "boolean";
  required?: boolean;
}

export class Router {
  public static all: Collection<string, InewRouter> = new Collection();
  constructor(public routeConfig: InewRouter) {
    let routerID = routeConfig.id;

    routeConfig.middlewares = routeConfig.middlewares ?? [];

    if (!routerID)
      routerID = `${routeConfig.path}-${routeConfig.method.toUpperCase()}`;

    const routerExist = Router.all.has(routerID);

    if (routerExist) {
      log.error(`Route ${routerID} already exists`);
      process.exit(10);
    }

    Router.all.set(routerID, { ...routeConfig, id: routerID });
  }
}
