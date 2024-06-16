"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appCore = void 0;
const tslib_1 = require("tslib");
const node_http_1 = tslib_1.__importDefault(require("node:http"));
const utils_1 = require("../utils");
const cors_1 = tslib_1.__importDefault(require("cors"));
const express_1 = tslib_1.__importDefault(require("express"));
require("express-async-errors");
const glob_1 = require("glob");
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const router_1 = require("./router");
class appCore {
    port = 3000;
    app;
    http;
    cors;
    helmet;
    modules;
    midlewares;
    routerPath = "routes";
    constructor({ port, cors = {}, helmet = {}, modules = [], midlewares = [], routerPath = "routes", }) {
        this.app = (0, express_1.default)();
        this.cors = cors;
        this.port = port;
        this.helmet = helmet;
        this.modules = modules;
        this.midlewares = midlewares;
        this.routerPath = routerPath;
        this.http = node_http_1.default.createServer(this.app);
    }
    listenServer() {
        this.http.listen(this.port, () => {
            utils_1.log.success(`Server running on port http://localhost:${this.port}/`);
        });
    }
    init(callback) {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cors_1.default)(this.cors));
        this.app.use((0, helmet_1.default)(this.helmet));
        this.setRoutes();
        this.listenServer();
        if (callback)
            callback();
    }
    async setRoutes() {
        // const url = import.meta.url;
        // const urlObject = new URL(url);
        // const pathname = urlObject.pathname;
        // const extension = pathname.substring(pathname.lastIndexOf("."));
        // if (extension == ".ts") console.log(extension);
        const routesDir = (0, node_path_1.join)((0, node_process_1.cwd)(), "src");
        const folders = ["routes/**/*.{ts,js}"];
        const paths = await (0, glob_1.glob)(folders, { cwd: routesDir });
        for (const path of paths) {
            await Promise.resolve(`${(0, node_path_1.join)(routesDir, path)}`).then(s => tslib_1.__importStar(require(s)));
        }
        router_1.Router.all.forEach((route) => {
            const { id, path, middlewares, method, execute } = route;
            console.log(route);
            const middlewareInRoute = [];
            const allMidlewares = Array.from(new Set([...this.midlewares, ...middlewares]));
            if (allMidlewares?.length)
                for (const middleware of allMidlewares) {
                    if (!allMidlewares[middleware])
                        throw new Error(`Middleware ${middleware} in route ${id} not found`);
                    middlewareInRoute.push(allMidlewares[middleware](route));
                }
            this.app[method](path, ...middlewareInRoute, execute);
            utils_1.log.success(`Rota ${id} registrada com sucesso`);
        });
    }
}
exports.appCore = appCore;
new appCore({ port: 3000, cors: {}, helmet: {} });
