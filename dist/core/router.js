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
// new Router({
//   path: "user",
//   method: "post",
//   params: { body: z.object({}) },
//   execute(req, res) {
//     req.body;
//   },
// });
// export class Router2 {
//   public static all: Collection<string, typeof Router> = new Collection();
//   public readonly router_id?: string;
//   public path: string;
//   public body: object = {};
//   public method: methods;
//   public middlewares: any[] = [];
//   // private exec: (req: Request, res: Response) => void ;
//   constructor({
//     id,
//     path,
//     method,
//     body,
//   }: {
//     id?: string;
//     path: string;
//     method: methods;
//     body:  z.ZodString;
//   }) {
//     this.router_id = id;
//     this.path = path;
//     this.method = method;
//     this.body = body;
//   }
//   public execute(req: ) {
//     // Implementação do método execute
//     // Exemplo de uso:
//     console.log(req.body); // Aqui você pode acessar req.body com segurança
//   }
// }
// interface IRouterConfig<T extends z.ZodRawShape, Q, P> {
//   query?: Q;
//   body: T;
//   params?: P;
//   execute: (req: Request<P, Q, z.infer<z.ZodObject>>, res: Response) => void;
// }
// function createRoute<B, Q, P>(routerConfig: IRouterConfig<B, Q, P>) {
//   return routerConfig;
// }
// createRoute({
//   body: z.object({ name: z.string().email() }),
//   execute(req, res) {
//     req.body.;
//   },
// });
// // function sla(params ) {
// //   return params.parce;
// // }
