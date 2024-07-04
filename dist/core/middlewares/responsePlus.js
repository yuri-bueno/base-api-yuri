"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responsePlus = responsePlus;
function responsePlus(route) {
    return (req, res, next) => {
        res.success = (json = {}) => {
            res.json(Object.assign({ success: true }, json));
        };
        res.reject = (text, json = {}) => {
            if (res.statusCode === 200)
                res.status(400);
            res.json(Object.assign({ success: false }, { error: text }, json));
        };
        return next();
    };
}
