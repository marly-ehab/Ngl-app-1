import  * as authRepository from "../repository/auth.repository.js";
import * as otpRepository from "../repository/otp.repository.js";
import * as userRepository from "../../user/repository/user.repository.js";
//import bcrypt from "bcrypt";
//import crypto from "node:crypto";
//import jwt from "jsonwebtoken";
import {sendEmail} from "../../../lib/email/nodemailer.js";
import {toMs, toSeconds} from "../../../pkg/utils/time.js";
import {
    invalidCode, invalidPassword,
    otpExpired,
} from "../errors.js";
import {userAlreadyExist, userAlreadyVerified, userBanned, userNotExist, userNotVerified} from "../../user/errors.js";
import {generateOtpCode} from "../../../lib/utils/otp.js";
import {logger} from "../../../pkg/logger/logger.js";
import {generateToken} from "../utils/token.js";
import {comparePassword, hashPassword} from "../utils/hash.js";
import {OAuth2Client} from "google-auth-library";
import {AppError} from "../../../lib/error/error.js";
import { verifyGoogleToken } from "../../../lib/utils/google-auth.js";
import {mailjetProvider} from "../../../lib/email/init.js";
import {cacheProvider} from "../../../lib/cache/init.js";



export async function register(userData) {
    //1.check user existence
    const userExist =  await authRepository.checkUserExistByEmail(userData.email);
    //2.if yes, throw an error
    if (userExist) throw userAlreadyExist();
    //3.prepare data [hash-password]
    userData.password = await hashPassword(userData.password);
    //4. save user into DB -> is Verified:false
    const createdUser = await authRepository.createUser(userData);
    //5.generate and save otp into DB
    const otp = generateOtpCode()
    await otpRepository.createOTP({
        code: otp,
        email:userData.email,
        expiresAt:new Date(Date.now() + toMs(5,'minutes')),
    });
    await cacheProvider.set(`otp:${createdUser._id.toString()}`,otp,toSeconds(3,'minutes'));
    //6.send email verification otp
    await mailjetProvider.sendMail(userData.email, 'verification code', 'verification code is: ' + otp + '')
    return createdUser;
}
export async function verifyAccount(email, code) {
    //1.check user existence
    const user = await authRepository.checkUserExistByEmail(email);
    //1.1if not exist >> error "user not exist"
    if(!user) throw userNotExist();
    //1.2 if is Verified = true >> "you already verified"
    if (user.isVerified === true) throw userAlreadyVerified() ;
    //2. check otp validation
    const otp = await otpRepository.getOtpByEmail(email);
    //2.1 not exist into DB >> error >> "otp expired" >> "resend otp"
    if (!otp) throw otpExpired();
    //2.2 otp stored into DB >> code not equal code started
    if (otp.code!== code) throw  invalidCode();
    //3. switch your is Verified to true {update user}
    const updatedUser = await userRepository.updateUserByEmail(email,{isVerified: true});
    //4. delete otp from DB
    await otpRepository.deleteOTP(email);

    return updatedUser;
}

export async function login(email, password) {
    //1.check user existence
    const user = await authRepository.checkUserExistByEmail(email);
    //1.1 not exist
    if (!user)throw userNotExist();
    //1.2 not verified
    if(user.isVerified === false) throw userNotVerified();
    //2. compare password
    const match = await comparePassword(password,user['password']);
    if(!match) throw invalidPassword();

    //2.1 banned user can't login
    if (user.isBanned) throw userBanned();
    //2.2 twostep verification enabled >> send otp, token comes after verifying it
    if (user.isTwoStepEnabled) {
        await sendOtp(email);
        return {twoStepRequired: true};
    }

    return {token: generateToken({id:user._id,name:user.name,role:user.role})};
}

//step 2 of login
export async function verifyLoginTwoStep(email, code) {
    const user = await authRepository.checkUserExistByEmail(email);
    if (!user) throw userNotExist();
    if (user.isBanned) throw userBanned();
    const otp = await otpRepository.getOtpByEmail(email);
    if (!otp) throw otpExpired();
    if (otp.code !== code) throw invalidCode();
    await otpRepository.deleteOTPByEmail(email);
    return generateToken({id:user._id,name:user.name,role:user.role});
}

export async function enableTwoStep(userId) {
    await userRepository.updateUserById(userId, {isTwoStepEnabled: true});
}

export async function sendOtp(email){
    //1.check user existence
    const user = await authRepository.checkUserExistByEmail(email);
    if (!user)throw userNotExist();
    //2. delete old otp
    await otpRepository.deleteOTPByEmail(email);
    //3. generate and save it into DB
    const code = generateOtpCode();
    
    await  otpRepository.createOTP({
        code: code,
        email:email,
        expiresAt:Date.now() + toMs( 3 , 'minutes')
    })
    //4.send otp email
    await mailjetProvider.sendMail(email, 'new otp', `<p>your new otp is ${code}</p>`)
}

export async function resetPassword(email, code, newPassword) {
    //1. verify otp code
    const otp = await otpRepository.getOtpByEmail(email);
    if (!otp) throw otpExpired();
    if (otp.code !== code) throw invalidCode();

    //2. hash password
    const hashedPassword = await hashPassword(newPassword);

    //3. update user password
    await userRepository.updateUserByEmail(email, { password: hashedPassword });

    //4. delete otp
    await otpRepository.deleteOTPByEmail(email);
}

export async function loginWithGoogle(idToken){
    //1.verify idToken
    const payload =await verifyGoogleToken(idToken)
    //2.check user exists
    const user = await authRepository.checkUserExistByEmail(payload.email)
    //3. if exists >> generate token
    if (user){
        //banned user can't login with google either
        if (user.isBanned) throw userBanned();
        return generateToken({
            id:user._id,
            name:user.name,
            role:user.role});
    }
    //4.if not exist create user >> generate Token
    const createdUser = await authRepository.createUser({
        name:payload.name,
        email:payload.email,
        provider:'google',
        isVerified:true,
    });
    return generateToken({
        id: createdUser._id,
        name:createdUser.name,
        role:createdUser.role,
    })
}