"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.appCore = exports.Router = void 0;
const core_1 = require("./modules/core");
Object.defineProperty(exports, "appCore", { enumerable: true, get: function () { return core_1.appCore; } });
const router_1 = require("./modules/router");
Object.defineProperty(exports, "Router", { enumerable: true, get: function () { return router_1.Router; } });
const index_1 = require("./utils/index");
Object.defineProperty(exports, "log", { enumerable: true, get: function () { return index_1.log; } });
