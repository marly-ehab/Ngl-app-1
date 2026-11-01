import { fileTypeFromBuffer } from "file-type";
import fs from "fs";
import {AppError} from "../../lib/error/error.js";

export const allowedfields ={
    images:['image/png','image/jpeg'],
    files:['application/pdf','application/msword'],
    videos:['video/mp4'],
    audios:['audio/mp3'],
}

// Middleware to validate file type by magic number (file signatures)
export const fileValidation = (allowedTypes= allowedfields.images) =>
    async (req, res, next) => {
    try {
        if(req.file.size > 5*1024*1024){
            throw new AppError('exceeded size allowed',400);
        }
        // get the file path
        const filePath = req.file.path;
        // read the file and return buffer
        const buffer = fs.readFileSync(filePath);
        // get the file type
        const type = await fileTypeFromBuffer(buffer);
        // validate
        const allowedTypes = allowedfields.images;
        if (!type || !allowedTypes.includes(type.mime))
            return next(new AppError("Invalid file type",400));

        return next();
    } catch (error) {
        return next(error);
    }
};
