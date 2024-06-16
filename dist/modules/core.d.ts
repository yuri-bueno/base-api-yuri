import { CorsOptions } from "cors";
import "express-async-errors";
import { HelmetOptions } from "helmet";
interface IAppCore {
    port: number;
    cors?: CorsOptions;
    helmet?: HelmetOptions;
    modules?: any[];
    midlewares?: any[];
    routerPath?: string;
}
export type Imiddleware = any;
export declare class appCore {
    readonly port: number;
    private app;
    private http;
    private cors;
    private helmet;
    private modules;
    private midlewares;
    private routerPath;
    constructor({ port, cors, helmet, modules, midlewares, routerPath, }: IAppCore);
    private listenServer;
    init(callback?: Function): void;
    private setRoutes;
}
export {};
