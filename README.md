### Exemplo route and middleware

```ts
import { IRouter, personalRequest } from "@/core/router";
import apiErrors from "@/utils/erros";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { Route } from "..";

function authMiddleware(role: string) {
  console.log(role);

  return (routeConfig: IRouter) => {
    console.log(routeConfig);

    return (req: Request, res: Response, next: NextFunction) => {
      console.log(req.body);

      role;

      if (role != "admin")
        return res.status(401).json({ message: "role is not admin" });

      next();
    };
  };
}
interface req2 extends personalRequest {
  arroz?: 2;
}
let count = 0;

new Route({
  method: "post",
  path: "/exemplo",
  files: { folder: "test", type: "image/", max: 2 },
  middlewares: [authMiddleware("admin")],
  params: {
    body: z.object({
      name: z.string(),
      isTrue: z.coerce.boolean().default(true),
      idade: z.coerce.number().max(5, apiErrors.LONG_NUMBER_ERROR),
      email: z.string().email("não é um email."),
      list: z.array(z.string().max(5)).or(
        //or in muilti-form = (files exist)
        z
          .string()
          .max(5)
          .transform((field) => [field])
      ),
    }),
  },

  execute(req: req2, res) {
    const files = req.saveFiles();

    if (files.success) {
      console.log(files.ids);
    }

    count++;
    res.status(200).json({ count, body: req.body });
    console.log(count);
  },
});
```
