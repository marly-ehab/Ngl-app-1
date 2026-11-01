import{Router} from "express";
import {uploadFilesArray, uploadSingleFile} from "../../pkg/media/multer.js";
import {allowedfields, fileValidation} from "../../pkg/media/file.validation.js";
import{guard, adminOnly} from '../../lib/auth/guard.js'
import * as userController from "./controller/user.controller.js";
// import {withCache} from "../../lib/cache/with.Cache.js";
// import {User} from "./model/user.model.js";
//import {rbac} from "../../lib/auth"


const userRouter = Router();

// userRouter.get('/get-all-users',
//     rbac('doctor'),withCache(async (req, res, next) => {
//         const users = await  User.find();
//         res.json(users);
//     })
//     )

userRouter.post('/upload-profile-pic',
    guard,
    uploadSingleFile('pp'),
    fileValidation(),
    userController.uploadprofilepic
    );

    userRouter.post('/upload-cv',
        uploadSingleFile('cv',allowedfields.files),
        fileValidation(allowedfields.files),
        (req,res,next) =>{
            res.json('ok')


        });

    userRouter.post('/upload-cover-images',uploadFilesArray('cover-images',3),(req,res,next)=>{
        console.log(req.file);
        res.json('ok')

    }
    );
userRouter.patch('/:userId/ban', guard, adminOnly, userController.banUser);
    export default userRouter;