import { InewRouter } from "../@types/router";
import { Collection } from "@discordjs/collection";
export declare class Router {
    routeConfig: InewRouter;
    static all: Collection<string, InewRouter>;
    constructor(routeConfig: InewRouter);
}
