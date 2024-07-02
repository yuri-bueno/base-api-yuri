import { NextFunction, Request } from "express";
import { IRouter } from "./router";

export function responsePlus(route: IRouter) {
  return (req: Request, res: any, next: NextFunction) => {
    res.success = (json = {}) => {
      res.json(Object.assign({ success: true }, json));
    };

    res.reject = (text: string, json = {}) => {
      if (res.statusCode === 200) res.status(400);
      res.json(Object.assign({ success: false }, { error: text }, json));
    };

    return next();
  };
}
