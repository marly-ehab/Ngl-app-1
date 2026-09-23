import {otp} from '../model/otp.model.js';

export async function deleteOTPByEmail(email) {
    return await otp.deleteMany({email: email});
}

export async function createOTP(otpData) {
    return await otp.create(otpData);
}

export async function getOtpByEmail(email) {
    return await otp.findOne({
        email: email
    });
}

export async function deleteOTP(email) {
    return await otp.deleteMany({email: email});
}