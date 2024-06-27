### new route example

```ts
import { Route, apiErrors } from "zac-api";
import z from "zod";

new Route({
  method: "post",
  path: "/exemple",
  files: { folder: "test", type: "image/", max: 2 },
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

  execute(req, res) {
    const files = req.saveFiles();

    if (files.success) {
      console.log(files.ids);
    }

    res.status(200).json({ body: req.body });
  },
});
```

### new middleware exemple

```ts
import { IRouter } from "zac-api";

import { NextFunction, Request, Response } from "express"; // in zac-api

function authMiddleware(role: string) {
  return (routeConfig: IRouter) => {
    return (req: Request, res: Response, next: NextFunction) => {
      console.log(role);
      console.log(routeConfig);
      console.log(req.body);

      if (role != "admin")
        return res.status(401).json({ message: "role is not admin" });

      next();
    };
  };
}

interface IAuthReq extends personalRequest {
  isAuth?: boolean;
}

new Route({
  method: "post",
  path: "/exemple",
  middlewares: [authMiddleware("admin")],
  params: {
    body: z.object({
      name: z.string(),
    }),
  },

  execute(req: IAuthReq, res) {
    const files = req.saveFiles();

    if (files.success) {
      console.log(files.ids);
    }

    res.status(200).json({ body: req.body });
  },
});
```
