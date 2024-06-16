"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const utils_1 = require("../utils");
const collection_1 = require("@discordjs/collection");
class Router {
    routeConfig;
    static all = new collection_1.Collection();
    constructor(routeConfig) {
        this.routeConfig = routeConfig;
        let routerID = routeConfig.id;
        routeConfig.middlewares = routeConfig.middlewares ?? [];
        if (!routerID)
            routerID = `${routeConfig.path}-${routeConfig.method.toUpperCase()}`;
        const routerExist = Router.all.has(routerID);
        if (routerExist) {
            utils_1.log.error(`Route ${routerID} already exists`);
            process.exit(10);
        }
        Router.all.set(routerID, { ...routeConfig, id: routerID });
    }
}
exports.Router = Router;
