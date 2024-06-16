import { Request, Response } from "express";
import { Imiddleware } from "../modules/core";

export interface InewRouterGet {
  id?: string;
  path: string;
  method: "get";

  params?: {
    query?: { [key: string]: Iparams };
    params?: { [key: string]: Iparams };
  };
  middlewares?: any[];
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
