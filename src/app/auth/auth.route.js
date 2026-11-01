import{Router} from "express";
import * as authController from "./controller/auth.controller.js";
import {idempotency} from "../../lib/idempotency/idempotency.js";
import {guard} from "../../lib/auth/guard.js";

const authRouter = Router();

authRouter.post('/register',authController.register);
authRouter.patch('/verify-account',authController.verifyAccount);
authRouter.post('/login', authController.login);
authRouter.post ('/send-otp', authController.sendOtp);
authRouter.patch('/reset-password',idempotency(), authController.resetPassword);
authRouter.post('/login-with-google',authController.loginWithGoogle);
authRouter.post('/forget-password', authController.sendOtp);
authRouter.post('/login/verify-2fa', authController.verifyLoginTwoStep);
authRouter.patch('/enable-2fa', guard, authController.enableTwoStep);
export default authRouter;