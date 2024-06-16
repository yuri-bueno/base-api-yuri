import { appCore } from "./modules/core";
import { Router } from "./modules/router";

import { log } from "./utils/index";

new appCore({ port: 3000, cors: {} }).init();

export { Router, appCore, log };
