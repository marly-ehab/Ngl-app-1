import multer, {diskStorage} from 'multer';
import crypto from 'node:crypto';
import {AppError} from "../../lib/error/error.js";
import {allowedfields} from "./file.validation.js";
import fs from "fs";
//storage:
//1. disk [hdd]
//    folder>>
//     filename>>
//2. [memory] ram
function  multerUpload(allowedTypes=allowedfields.images){
 return   multer({
     fileFilter: function (req,file,cb){
         if(!allowedTypes.includes(file.mimetype)){
             fs.unlinkSync(file.path);
            return cb(new AppError('invalid file type',400),false)
         }
         cb(null,true);
     },
        storage: diskStorage({
            destination:'uploads',
            filename:function (req, file, cb) {
                console.log(file);
                cb(null,`${crypto.randomUUID()}-${file.originalname}`);
            }
        })
    })
}
export function  uploadSingleFile(filedName,allowedTypes=['image/png','image/jpeg']){

   return multerUpload(allowedTypes).single(filedName);
}

export function uploadFilesArray(fieldName,maxCount){

  return  multerUpload().array(fieldName,maxCount);
}

export function uploadFields(fields){

   return multerUpload().fields(fields)
}



