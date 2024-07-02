"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.ErrorHandler = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("../../utils");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
class ErrorHandler extends Error {
    statusCode;
    json;
    constructor({ message, status = 500, json = {}, }) {
        super(message);
        this.message = message;
        this.statusCode = status;
        this.json = json;
    }
}
exports.ErrorHandler = ErrorHandler;
function errorHandler(err, req, res, next) {
    if (!err.statusCode) {
        utils_1.log.warn(`\n  ${chalk_1.default.yellow(`Route: ${req.path}\n  method: ${req.method}`)}\n  ${chalk_1.default.red(err?.stack)}`);
        return res.status(500).json({
            success: false,
            error: "internal-error",
        });
    }
    return res
        .status(err.statusCode)
        .json(Object.assign({ success: false }, { error: err.message }, err.json));
}
exports.errorHandler = errorHandler;
