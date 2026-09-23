import  * as authRepository from "../repository/auth.repository.js";
import * as otpRepository from "../repository/otp.repository.js";
import * as userRepository from "../../user/repository/user.repository.js";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import {sendEmail} from "../../../common/email/nodemailer.js";
import {toMs} from "../../../common/utils/time.js";
import {
    invalidCode, invalidPassword,
    otpExpired,
} from "../errors.js";
import {userAlreadyExist, userAlreadyVerified, userNotExist, userNotVerified} from "../../user/errors.js";
import {generateOtpCode} from "../../../common/utils/otp.js";



export async function register(userData) {
    //1.check user existence
    const userExist =  await authRepository.checkUserExistByEmail(userData.email);
    //2.if yes, throw an error
    if (userExist) throw userAlreadyExist;
    //3.prepare data [hash-password]
    userData.password = await  bcrypt.hash(userData.password, 10);
    //4. save user into DB -> is Verified:false
    const createdUser = await authRepository.createUser(userData);
    //5.generate and save otp into DB
    const otp = generateOtpCode()
    await otpRepository.createOTP({
        code: otp,
        email:userData.email,
        expiresAt:new Date(Date.now() + toMs(5,'minutes')),
    });
    //6.send email verification otp
    await sendEmail(userData.email, 'verification code', 'verification code is: ' + otp + '')
    return createdUser;
}
export async function verifyAccount(email, code) {
    //1.check user existence
    const user = await authRepository.checkUserExistByEmail(email);
    //1.1if not exist >> error "user not exist"
    if(!user) throw userNotExist;
    //1.2 if is Verified = true >> "you already verified"
    if (user.isVerified === true) throw userAlreadyVerified ;
    //2. check otp validation
  const otp = await otpRepository.getOtpByEmail(email);
    //2.1 not exist into DB >> error >> "otp expired" >> "resend otp"
    if (!otp) throw otpExpired;
    //2.2 otp stored into DB >> code not equal code started
    if (otp.code !== code) throw  invalidCode;
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
    if (!user)throw userNotExist;
    //1.2 not verified
    if(user.isVerified === false) throw userNotVerified;
    //2. compare password
     const match = await bcrypt.compare(password, user.password);
     if(!match) throw invalidPassword;
    //3. generate access Token
   const token  =  jwt.sign(
        {id: user. _id, email:user.email,name:user.name },
        process.env.JWT_SECRET,
        {expiresIn:toMs(1,'hours')}
   );
   return token;

}

export async function sendOtp(email){
    //1.check user existence
    const user = await authRepository.checkUserExistByEmail(email);
    if (!user)throw userNotExist;
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
  await   sendEmail(email, 'new otp', '<p>your new otp is ${code};</p>')
}