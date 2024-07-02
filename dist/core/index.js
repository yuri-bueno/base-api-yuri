"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appCore = void 0;
const tslib_1 = require("tslib");
const node_http_1 = tslib_1.__importDefault(require("node:http"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const express_1 = tslib_1.__importDefault(require("express"));
require("express-async-errors");
const glob_1 = require("glob");
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const yargs_1 = tslib_1.__importDefault(require("yargs"));
const formatParams_1 = tslib_1.__importDefault(require("./formatParams"));
const multer_1 = require("./multer");
const responsePlus_1 = require("./responsePlus");
const router_1 = require("./router");
class appCore {
    port = 3000;
    app;
    http;
    cors;
    helmet;
    middlewares;
    options = {
        formatParams: true,
        loadFiles: [],
    };
    constructor({ port, cors = {}, helmet = {}, midlewares = [], options, }) {
        this.app = (0, express_1.default)();
        this.cors = cors;
        this.port = port;
        this.helmet = helmet;
        this.middlewares = midlewares;
        this.options = options ?? { loadFiles: [] };
        this.http = node_http_1.default.createServer(this.app);
    }
    async init(callback) {
        console.time(log.server("startup in"));
        this.app.use((0, cors_1.default)(this.cors));
        this.app.use((0, helmet_1.default)(this.helmet));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        await this.startDefaultMiddlewares();
        await this.setRoutes();
        await this.loadFiles(this.options?.loadFiles ?? []);
        await await this.listenServer();
        console.timeEnd(log.server("startup in"));
        if (callback)
            await callback();
    }
    async listenServer() {
        await new Promise((resolve) => {
            this.http.listen(this.port, () => {
                console.log(log.server(`Server running on port http://localhost:${this.port}/`));
                resolve(true);
            });
        });
    }
    setUse(any) {
        this.app.use(any);
        return this;
    }
    async loadFiles(paths) {
        for (const path of paths) {
            const argv = await (0, yargs_1.default)(process.argv)
                .options({ $0: { type: "string", default: "a.js" } })
                .parse();
            const isTypeScript = argv.$0.endsWith("ts");
            const outDir = isTypeScript ? "src" : "dist";
            const routesDir = (0, node_path_1.join)((0, node_process_1.cwd)(), outDir);
            const folders = [`${path}/**/*.{ts,js}`];
            const pathsToLoading = await (0, glob_1.glob)(folders, { cwd: routesDir });
            for (const path of pathsToLoading) {
                await Promise.resolve(`${(0, node_path_1.join)(routesDir, path)}`).then(s => tslib_1.__importStar(require(s)));
            }
        }
        return this;
    }
    startDefaultMiddlewares() {
        this.middlewares.push(multer_1.multerMiddleware);
        this.middlewares.push(formatParams_1.default);
        this.middlewares.push(responsePlus_1.responsePlus);
    }
    async setRoutes() {
        await this.loadFiles(["routes"]);
        router_1.Route.all.forEach((route) => {
            const { id, path, middlewares = [], method, execute } = route;
            console.time(log.router(`Route ${id} registered`));
            const startedMiddlewares = [];
            const allMiddlewares = Array.from(new Set([...this.middlewares, ...middlewares]));
            for (const middleware of allMiddlewares) {
                startedMiddlewares.push(middleware(route));
            }
            this.app[method](path, ...startedMiddlewares, execute);
            console.timeEnd(log.router(`Route ${id} registered`));
        });
    }
}
exports.appCore = appCore;
const log = {
    success: (text) => chalk_1.default.black(`${chalk_1.default.bgGreenBright("[OK]")} ${chalk_1.default.green(text)}`),
    router: (text) => chalk_1.default.black(`${chalk_1.default.bgGreenBright("[ROUTER]")} ${chalk_1.default.green(text)}`),
    server: (text) => chalk_1.default.black(`${chalk_1.default.bgCyanBright.white("[SERVER]")} ${chalk_1.default.cyan(text)}`),
    warn: (text) => chalk_1.default.black(`${chalk_1.default.bgYellowBright("[WARN]")} ${chalk_1.default.yellow(text)}`),
    error: (text) => chalk_1.default.black(`${chalk_1.default.bgRedBright(["ERROR"])} ${chalk_1.default.red(text)}`),
};
