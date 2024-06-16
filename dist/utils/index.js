"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootTo = exports.__rootname = exports.log = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
exports.log = {
    success: (text) => console.log(chalk_1.default.black(`${chalk_1.default.bgGreenBright("[OK]")}: ${chalk_1.default.green(text)}`)),
    info: (text) => console.log(chalk_1.default.black(`${chalk_1.default.bgCyanBright("[INFO]")}: ${chalk_1.default.cyan(text)}`)),
    warn: (text) => console.log(chalk_1.default.black(`${chalk_1.default.bgYellowBright("[WARN]")}: ${chalk_1.default.yellow(text)}`)),
    error: (text) => console.log(chalk_1.default.black(`${chalk_1.default.bgRedBright(["ERROR"])}: ${chalk_1.default.red(text)}`)),
};
exports.__rootname = (0, node_process_1.cwd)();
const rootTo = (...path) => (0, node_path_1.join)(exports.__rootname, ...path);
exports.rootTo = rootTo;
