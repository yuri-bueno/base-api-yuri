# Zac API

**Zac API** é uma biblioteca TypeScript que facilita a criação de rotas com validação automática de `query`, `body` e `params` utilizando [Zod](https://zod.dev/). Ela também oferece suporte para upload de arquivos com limites e tipos definidos.

### Índice

- [Instalação](#Instalação)

- [Inicialização Rápida com npx](#Inicialização-Rápida-com-`npx`)

- [Uso Básico](#Uso-Básico)

  - [Iniciando a API](#Iniciando-a-API)

  - [Estrutura do Projeto](#Estrutura-do-Projeto)

  - [Criando rotas](#Criando-rotas)

- [Usando Middlewares](#Usando-Middlewares)

## Instalação

```
npm install zac-api
```

## Inicialização Rápida com `npx`

Você pode criar rapidamente uma estrutura de projeto utilizando o comando:

```
npx zac-api
```

Isso vai guiar você na configuração inicial de um projeto usando `zac-api`, permitindo que escolha:

- O diretório onde o projeto será criado

- Módulos adicionais como:

  - format-params
  - auth
  - multer

- O ORM (ex.: Prisma) e o banco de dados (ex.: MySQL, PostgreSQL, etc.)

## Uso Básico

### Estrutura do Projeto

Uma estrutura típica de projeto utilizando zac-api poderia ser assim:

`Ao iniciar a aplicação, todas todos os arquivos dentro da pasta routes são carregadas automaticamente.`

```
my-api/
├── src/
│   ├── index.ts
│   └── routes/
│       ├── exampleRoute.ts
│       └── anotherRoute.ts
├── package.json
├── tsconfig.json
└── ...
```

### Iniciando a API

```ts
import { appCore } from 'zac-api';

new appCore({ port: 3000, cors: {} }).init();
```

Aqui:

- port: Define a porta em que a API será executada (neste caso, porta 3000).

- cors: Permite configurar as políticas de CORS da API (dá biblioteca [cors](https://www.npmjs.com/package/cors)).

### Criando rotas

Cada rota pode ser definida dentro da pasta `routes` e será automaticamente carregada pelo `appCore`. Um exemplo de rota em `src/routes/exampleRoute.ts` seria:

```ts
import { Route, apiErrors } from 'zac-api';
import z from 'zod';

new Route({
  method: 'post',
  path: '/exemple',
  files: { folder: 'test', type: 'image/', max: 2 },
  params: {
    body: z.object({
      name: z.string(),
      isTrue: z.coerce.boolean().default(true),
      idade: z.coerce.number().max(5, apiErrors.LONG_NUMBER_ERROR),
      email: z.string().email('não é um email.'),
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

## Usando Middlewares

### Exemplo de Middleware de Autenticação

Neste exemplo, criamos um middleware de autenticação que verifica se o usuário tem a função de "admin" antes de permitir que a rota prossiga:

```ts
import { IRouter } from 'zac-api';

import { NextFunction, Request, Response } from 'express'; // in zac-api

interface IAuthReq extends personalRequest {
  isAuth?: boolean;
}

function authMiddleware(role: string) {
  return (routeConfig: IRouter) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (role != 'admin') return res.status(401).json({ message: 'role is not admin' });

      next();
    };
  };
}

new Route({
  method: 'post',
  path: '/exemple',
  middlewares: [authMiddleware('admin')],
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
