"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = formatParams;
const filterWithBodyParams = ["params", "query", "body"];
const filterWithoutBodyParams = ["params", "query"];
function formatParams(route) {
    return (req, res, next) => {
        const message = "invalid-params";
        const errors = [];
        if (route.method != "get") {
            for (const filterParam of filterWithBodyParams) {
                if (!route.params?.[filterParam]) {
                    req[filterParam] = {};
                    continue;
                }
                const validParam = route.params[filterParam]?.safeParse(req[filterParam]);
                if (!validParam?.success) {
                    for (const issue of validParam?.error?.issues ?? []) {
                        errors.push({ path: issue.path[0], message: issue.message });
                    }
                    continue;
                }
                req[filterParam] = validParam.data;
            }
        }
        else {
            for (const filterParam of filterWithoutBodyParams) {
                if (!route.params?.[filterParam]) {
                    req[filterParam] = {};
                    continue;
                }
                const validParam = route.params[filterParam]?.safeParse(req[filterParam]);
                if (!validParam?.success) {
                    for (const issue of validParam?.error?.issues ?? []) {
                        errors.push({ path: issue.path[0], message: issue.message });
                    }
                    continue;
                }
                req[filterParam] = validParam.data;
            }
        }
        if (errors.length)
            return res.status(401).json({ success: false, message, errors });
        next();
    };
}
