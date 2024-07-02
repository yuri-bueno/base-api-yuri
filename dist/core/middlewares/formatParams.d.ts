/// <reference types="@types/express" />
import { NextFunction, Request, Response } from "express";
import { IRouter } from "../router";
export default function formatParams(route: IRouter): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
