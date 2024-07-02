import http from "node:http";

import chalk from "chalk";
import cors, { CorsOptions } from "cors";
import express, { Application } from "express";
import "express-async-errors";
import { glob } from "glob";
import helmet, { HelmetOptions } from "helmet";
import { join } from "node:path";
import { cwd } from "node:process";
import yargs from "yargs";
import formatParams from "./formatParams";
import { multerMiddleware } from "./multer";
import { Imiddleware, Route } from "./router";

export interface IAppCore {
  port: number;
  cors?: CorsOptions;
  helmet?: HelmetOptions;
  midlewares?: Imiddleware[];
  options?: IAppCoreOptions;
}

interface IAppCoreOptions {
  formatParams?: boolean;
  routerPath?: string;
  loadFiles?: string[];
}

export class appCore {
  public readonly port: number = 3000;
  private app: Application;
  private http: http.Server;
  private cors: CorsOptions;
  private helmet: HelmetOptions;
  private middlewares: Imiddleware[];
  private options = {
    formatParams: true,
    loadFiles: [] as string[],
  } as IAppCoreOptions;
  constructor({
    port,
    cors = {},
    helmet = {},
    midlewares = [],
    options,
  }: IAppCore) {
    this.app = express();
    this.cors = cors;
    this.port = port;
    this.helmet = helmet;
    this.middlewares = midlewares;

    this.options = options ?? { loadFiles: [] };

    this.http = http.createServer(this.app);
  }

  public async init(callback?: Function) {
    console.time(log.server("startup in"));
    this.app.use(cors(this.cors));
    this.app.use(helmet(this.helmet));

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    await this.startDefaultMiddlewares();
    await this.setRoutes();
    await this.loadFiles(this.options?.loadFiles ?? []);

    await await this.listenServer();
    console.timeEnd(log.server("startup in"));
    if (callback) await callback();
  }
  private async listenServer() {
    await new Promise((resolve) => {
      this.http.listen(this.port, () => {
        console.log(
          log.server(`Server running on port http://localhost:${this.port}/`)
        );
        resolve(true);
      });
    });
  }
  public setUse(any: any) {
    this.app.use(any);
    return this;
  }

  private async loadFiles(paths: string[]) {
    for (const path of paths) {
      const argv = await yargs(process.argv)
        .options({ $0: { type: "string", default: "a.js" } })
        .parse();

      const isTypeScript = argv.$0.endsWith("ts");
      const outDir = isTypeScript ? "src" : "dist";

      const routesDir = join(cwd(), outDir);

      const folders = [`${path}/**/*.{ts,js}`];

      const pathsToLoading = await glob(folders, { cwd: routesDir });

      for (const path of pathsToLoading) {
        await import(join(routesDir, path));
      }
    }

    return this;
  }

  private startDefaultMiddlewares() {
    this.middlewares.push(multerMiddleware as any);
    this.middlewares.push(formatParams);
  }

  private async setRoutes() {
    await this.loadFiles(["routes"]);

    Route.all.forEach((route) => {
      const { id, path, middlewares = [], method, execute } = route;

      console.time(log.router(`Route ${id} registered`));
      const startedMiddlewares = [];

      const allMiddlewares = Array.from(
        new Set([...this.middlewares, ...middlewares])
      );

      for (const middleware of allMiddlewares) {
        startedMiddlewares.push(middleware(route));
      }

      this.app[method](path, ...startedMiddlewares, execute as any);

      console.timeEnd(log.router(`Route ${id} registered`));
    });
  }
}

const log = {
  success: (text: string) =>
    chalk.black(`${chalk.bgGreenBright("[OK]")} ${chalk.green(text)}`),
  router: (text: string) =>
    chalk.black(`${chalk.bgGreenBright("[ROUTER]")} ${chalk.green(text)}`),

  server: (text: string) =>
    chalk.black(`${chalk.bgCyanBright.white("[SERVER]")} ${chalk.cyan(text)}`),

  warn: (text: string) =>
    chalk.black(`${chalk.bgYellowBright("[WARN]")} ${chalk.yellow(text)}`),

  error: (text: string) =>
    chalk.black(`${chalk.bgRedBright(["ERROR"])} ${chalk.red(text)}`),
};
