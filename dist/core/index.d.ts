import { CorsOptions } from "cors";
import "express-async-errors";
import { HelmetOptions } from "helmet";
import { Imiddleware } from "./router";
export interface IAppCore {
    port: number;
    cors?: CorsOptions;
    helmet?: HelmetOptions;
    midlewares?: Imiddleware[];
    options?: {
        formatParams: boolean;
        routerPath?: string;
    };
}
export declare class appCore {
    readonly port: number;
    private app;
    private http;
    private cors;
    private helmet;
    private middlewares;
    private routerPath;
    private options;
    constructor({ port, cors, helmet, midlewares, options, }: IAppCore);
    init(callback?: Function): Promise<void>;
    private listenServer;
    setUse(any: any): this;
    private startDefaultMiddlewares;
    private setRoutes;
}
