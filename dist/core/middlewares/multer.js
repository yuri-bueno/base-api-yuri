"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFiles = exports.multerMiddleware = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const multer_1 = tslib_1.__importDefault(require("multer"));
const node_process_1 = require("node:process");
const path_1 = tslib_1.__importDefault(require("path"));
const uuid_1 = require("uuid");
const __rootname = (0, node_process_1.cwd)();
function multerMiddleware(route) {
    return (req, res, next) => {
        if (!route.files)
            return next();
        const filesConfig = route.files;
        const maxCountFiles = route.files.max || 1;
        const fileSize = route.files.size || 1024 * 1024 * 5;
        const pathUpload = path_1.default.resolve(__rootname, "uploads");
        if (!fs_1.default.existsSync(pathUpload)) {
            fs_1.default.mkdirSync(pathUpload, { recursive: true });
        }
        const uploadsFolder = path_1.default.resolve(__rootname, "uploads", route.files?.folder);
        const upload = (0, multer_1.default)({
            storage: multer_1.default.memoryStorage(),
            fileFilter: (req, file, cb) => {
                if (filesConfig.type === "all")
                    return cb(null, true);
                if (file.mimetype.startsWith(filesConfig.type)) {
                    cb(null, true);
                }
                else {
                    cb(new Error("invalid-file-type"));
                }
            },
            limits: {
                fileSize: fileSize,
                files: maxCountFiles,
            },
        });
        return upload.array("files", maxCountFiles)(req, res, (err) => {
            if (err) {
                if (err.message === "invalid-file-type") {
                    return res.status(415).json({ success: false, message: err.message }); // 415 Unsupported Media Type
                }
                return res.status(400).json({ success: false, message: err.message });
            }
            if (!req.files?.length && !route.files?.required)
                return res.status(400).json({ success: false, message: "empty-files" });
            req.saveFiles = () => {
                return saveFiles(req.files, uploadsFolder);
            };
            next();
        });
    };
}
exports.multerMiddleware = multerMiddleware;
function saveFiles(files, destinationFolder) {
    if (!fs_1.default.existsSync(destinationFolder))
        fs_1.default.mkdirSync(destinationFolder, { recursive: true });
    const ids = [];
    files.forEach((file) => {
        try {
            const new_id = (0, uuid_1.v4)();
            ids.push(new_id);
            const destinationPath = path_1.default.resolve(destinationFolder, `${new_id}${path_1.default.extname(file.originalname)}`);
            fs_1.default.writeFileSync(destinationPath, file.buffer);
        }
        catch (error) {
            console.log(error);
            return { success: false, ids };
        }
    });
    return { success: true, ids };
}
exports.saveFiles = saveFiles;
