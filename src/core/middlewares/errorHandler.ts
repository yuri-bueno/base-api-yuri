import { log } from "@/utils";
import chalk from "chalk";

import { NextFunction, Request, Response } from "express";

export class ErrorHandler extends Error {
  statusCode;
  json;
  constructor({
    message,
    status = 500,
    json = {},
  }: {
    message: string;
    status: number;
    json?: object;
  }) {
    super(message);
    this.message = message;
    this.statusCode = status;
    this.json = json;
  }
}

export function errorHandler(
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!err.statusCode) {
    log.warn(
      `\n  ${chalk.yellow(
        `Route: ${req.path}\n  method: ${req.method}`
      )}\n  ${chalk.red(err?.stack)}`
    );

    return res.status(500).json({
      success: false,
      error: "internal-error",
    });
  }

  return res
    .status(err.statusCode)
    .json(Object.assign({ success: false }, { error: err.message }, err.json));
}
