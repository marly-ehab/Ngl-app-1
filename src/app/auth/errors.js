import { AppError } from "../../lib/error/error.js";

export const otpExpired = () => new AppError("OTP expired, please resend OTP", 410);
export const invalidCode = () => new AppError("Invalid code", 400);
export const invalidPassword = () => new AppError("Invalid password", 401);


