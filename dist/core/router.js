"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
const utils_1 = require("../utils");
const collection_1 = require("@discordjs/collection");
class Route {
    static all = new collection_1.Collection();
    id;
    path;
    method;
    middlewares;
    files;
    params;
    execute;
    constructor(config) {
        const { path, params, method, middlewares = [], files, execute } = config;
        this.id = `${path}-${method.toUpperCase()}`;
        this.path = path.startsWith("/") ? path : `/${path}`;
        this.method = method;
        this.params = params;
        this.middlewares = middlewares;
        this.files = files;
        this.execute = execute;
        const routerExist = Route.all.has(this.id);
        if (routerExist) {
            utils_1.log.error(`Route ${this.id} already exists`);
            process.exit(1);
        }
        Route.all.set(this.id, {
            id: this.id,
            path: this.path,
            method: this.method,
            params: this.params,
            middlewares: this.middlewares,
            files: this.files,
            execute: this.execute,
        });
    }
}
exports.Route = Route;
