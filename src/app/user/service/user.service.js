import * as userRepository from "../repository/user.repository.js";
import {userNotExist} from "../errors.js";
import {AppError} from "../../../lib/error/error.js";
import fs from "fs";

export const uploadprofilepic =async (userId, file) => {
    // get user old image
    const user = await userRepository.findUserById(userId);
    if (!user) throw userNotExist();
//delete old image from server
    if (user.profilePicPath) {
        fs.unlinkSync(user.profilePicPath);
    }
//update new image
    await userRepository.updateUserByEmail(user.email, {profilePicPath: file.path});
}

export const banUser = async (adminId, targetId) => {
    if (String(adminId) === String(targetId)) throw new AppError("you can't ban yourself", 400);
    const target = await userRepository.findUserById(targetId);
    if (!target) throw userNotExist();
    await userRepository.updateUserById(targetId, {isBanned: true});
}