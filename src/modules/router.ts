import { InewRouter } from "@/@types/router";
import { log } from "@/utils";

import { Collection } from "@discordjs/collection";

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
