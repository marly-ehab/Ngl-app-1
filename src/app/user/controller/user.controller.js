import * as userService from "../service/user.service.js";
import {file} from "zod";

export const uploadprofilepic =async (req, res, next) => {
    try {
        await userService.uploadprofilepic(req.user.id, req.file);


        res.json({message: "upload profile successfully", success: true});

    } catch (error) {
        next(error)
    }
}

export const banUser = async (req, res, next) => {
    try {
        await userService.banUser(req.user.id, req.params.userId);
        res.json({message: "user banned successfully", success: true});
    } catch (error) {
        next(error)
    }
}