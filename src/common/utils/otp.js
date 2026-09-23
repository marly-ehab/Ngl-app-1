import crypto from "node:crypto";

export function generateOtpCode(){
    return  crypto.randomInt(100000, 999999).toString();
}