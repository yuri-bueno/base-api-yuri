import { NextFunction, Request, Response } from "express";
import { IRouter } from "./router";

const filterWithBodyParams = ["params", "query", "body"] as const;
const filterWithoutBodyParams = ["params", "query"] as const;

export default function formatParams(route: IRouter) {
  return (req: Request, res: Response, next: NextFunction) => {
    const message = "invalid-params";
    const errors = [];

    if (route.method != "get") {
      for (const filterParam of filterWithBodyParams) {
        if (!route.params?.[filterParam]) {
          req[filterParam] = {};
          continue;
        }
        const validParam = route.params[filterParam]?.safeParse(
          req[filterParam]
        );

        if (!validParam?.success) {
          for (const issue of validParam?.error?.issues ?? []) {
            errors.push({ path: issue.path, message: issue.message });
          }
          continue;
        }

        req[filterParam] = validParam.data;
      }
    } else {
      for (const filterParam of filterWithoutBodyParams) {
        if (!route.params?.[filterParam]) {
          req[filterParam] = {};
          continue;
        }
        const validParam = route.params[filterParam]?.safeParse(
          req[filterParam]
        );

        if (!validParam?.success) {
          for (const issue of validParam?.error?.issues ?? []) {
            errors.push({ path: issue.path, message: issue.message });
          }
          continue;
        }

        req[filterParam] = validParam.data;
      }
    }

    if (errors.length)
      return res.status(401).json({ success: false, message, errors });

    next();
  };
}
