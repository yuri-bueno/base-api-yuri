import { NextFunction, Request } from "express";
import { IRouter } from "../router";
export declare function responsePlus(route: IRouter): (req: Request, res: any, next: NextFunction) => void;
