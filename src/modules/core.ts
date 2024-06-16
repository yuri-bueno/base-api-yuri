import http from "node:http";
import { log } from "../utils";

import cors, { CorsOptions } from "cors";
import express, { Application } from "express";
import "express-async-errors";
import { glob } from "glob";
import helmet, { HelmetOptions } from "helmet";
import { join } from "node:path";
import { cwd } from "node:process";
import { Router } from "./router";

interface IAppCore {
  port: number;
  cors?: CorsOptions;
  helmet?: HelmetOptions;
  modules?: any[];
  midlewares?: any[];
  routerPath?: string;
}
export type Imiddleware = any;

export class appCore {
  public readonly port: number = 3000;
  private app: Application;
  private http: http.Server;
  private cors: CorsOptions;
  private helmet: HelmetOptions;
  private modules: any[];
  private midlewares: Imiddleware[];
  private routerPath: string = "routes";

  constructor({
    port,
    cors = {},
    helmet = {},
    modules = [],
    midlewares = [],
    routerPath = "routes",
  }: IAppCore) {
    this.app = express();
    this.cors = cors;
    this.port = port;
    this.helmet = helmet;
    this.modules = modules;
    this.midlewares = midlewares;
    this.routerPath = routerPath;

    this.http = http.createServer(this.app);
  }

  private listenServer() {
    this.http.listen(this.port, () => {
      log.success(`Server running on port http://localhost:${this.port}/`);
    });
  }
  public init(callback?: Function) {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors(this.cors));
    this.app.use(helmet(this.helmet));
    this.setRoutes();

    this.listenServer();
    if (callback) callback();
  }

  private async setRoutes() {
    // const url = import.meta.url;
    // const urlObject = new URL(url);
    // const pathname = urlObject.pathname;
    // const extension = pathname.substring(pathname.lastIndexOf("."));

    // if (extension == ".ts") console.log(extension);
    const routesDir = join(cwd(), "src");
    const folders = ["routes/**/*.{ts,js}"];

    const paths = await glob(folders, { cwd: routesDir });

    for (const path of paths) {
      await import(join(routesDir, path));
    }

    Router.all.forEach((route) => {
      const { id, path, middlewares, method, execute } = route;
      console.log(route);

      const middlewareInRoute: Imiddleware[] = [];

      const allMidlewares = Array.from(
        new Set([...this.midlewares, ...(middlewares as Imiddleware[])])
      );

      if (allMidlewares?.length)
        for (const middleware of allMidlewares) {
          if (!allMidlewares[middleware])
            throw new Error(
              `Middleware ${middleware} in route ${id} not found`
            );

          middlewareInRoute.push(allMidlewares[middleware](route));
        }

      this.app[method](path, ...middlewareInRoute, execute);

      log.success(`Rota ${id} registrada com sucesso`);
    });
  }
}
new appCore({ port: 3000, cors: {}, helmet: {} });
