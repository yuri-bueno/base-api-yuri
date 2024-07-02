import { NextFunction, Response } from "express";
import fs from "fs";
import multer from "multer";
import { cwd } from "node:process";
import path from "path";

import { v4 as uuid4 } from "uuid";
import { IRouter, personalRequest } from "../router";

const __rootname = cwd();

export function multerMiddleware(route: IRouter) {
  return (req: personalRequest, res: Response, next: NextFunction) => {
    if (!route.files) return next();

    const filesConfig = route.files;

    const maxCountFiles = route.files.max || 1;

    const fileSize = route.files.size || 1024 * 1024 * 5;

    const pathUpload = path.resolve(__rootname, "uploads");

    if (!fs.existsSync(pathUpload)) {
      fs.mkdirSync(pathUpload, { recursive: true });
    }

    const uploadsFolder = path.resolve(
      __rootname,
      "uploads",
      route.files?.folder
    );

    const upload = multer({
      storage: multer.memoryStorage(),

      fileFilter: (req, file, cb) => {
        if (filesConfig.type === "all") return cb(null, true);

        if (file.mimetype.startsWith(filesConfig.type)) {
          cb(null, true);
        } else {
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
        return saveFiles(req.files as Express.Multer.File[], uploadsFolder);
      };

      next();
    });
  };
}

export function saveFiles(
  files: Express.Multer.File[],
  destinationFolder: string
) {
  if (!fs.existsSync(destinationFolder))
    fs.mkdirSync(destinationFolder, { recursive: true });

  const ids: string[] = [];

  files.forEach((file) => {
    try {
      const new_id = uuid4();
      ids.push(new_id);

      const destinationPath = path.resolve(
        destinationFolder,
        `${new_id}${path.extname(file.originalname)}`
      );

      fs.writeFileSync(destinationPath, file.buffer);
    } catch (error) {
      console.log(error);
      return { success: false, ids };
    }
  });

  return { success: true, ids };
}
