import { NextFunction, Response } from "express";
import { IRouter, personalRequest } from "../router";
export declare function multerMiddleware(route: IRouter): (req: personalRequest, res: Response, next: NextFunction) => void;
export declare function saveFiles(files: Express.Multer.File[], destinationFolder: string): {
    success: boolean;
    ids: string[];
};
