import * as authService from "../service/auth.service.js";
import { toMs } from "../../../pkg/utils/time.js";
import { loginDTO, registerDTO, resetPasswordDTO, verifyAccountDTO } from "../dto/auth.dto.js";
import { AppError } from "../../../lib/error/error.js";

function validateBody(schema, body) {
    const result = schema.safeParse(body);
    if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400);
    }
    return result.data;
}

export async function register(req, res, next) {
    try {
        const data = validateBody(registerDTO, req.body);
        const createdUser = await authService.register(data);
        res.status(201).json({
            message: 'user created successfully',
            success: true,
            data: createdUser,
        });
    } catch (error) {
        next(error);
    }
}

export async function verifyAccount(req, res, next) {
    try {
        const { email, code } = validateBody(verifyAccountDTO, req.body);
        const updatedUser = await authService.verifyAccount(email, code);
        res.json({
            message: 'user verified successfully',
            success: true,
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = validateBody(loginDTO, req.body);
        const result = await authService.login(email, password);
        //2 step verification enabled >> no token yet
        if (result.twoStepRequired) {
            return res.json({message: 'verification code sent to your email', success: true, twoStepRequired: true});
        }
        res.cookie('access_token', result.token, {
            httpOnly: true,
            maxAge: toMs(1, 'hours'),
        });
        res.json({
            message: 'User Login Successfully',
            success: true,
        });
    } catch (error) {
        next(error);
    }
}

export async function sendOtp(req, res, next) {
    try {
        const { email } = req.body;
        await authService.sendOtp(email);
        res.json({ message: "new otp sent, check your email", success: true });
    } catch (error) {
        next(error);
    }
}

export async function resetPassword(req, res, next) {
    try {
        const { email, code, newPassword } = validateBody(resetPasswordDTO, req.body);
        await authService.resetPassword(email, code, newPassword);
        res.json({
            message: 'password reset successfully',
            success: true,
        });
    } catch (error) {
        next(error);
    }
}

export async function loginWithGoogle(req, res, next) {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            throw new AppError('idToken is required', 400);
        }

        const token = await authService.loginWithGoogle(idToken);

        res.cookie('access_token', token, {
            httpOnly: true,
            maxAge: toMs(1, 'hours'),
        });

        res.json({ message: 'user login successfully', success: true });
    } catch (error) {
        next(error);
    }
}

export async function verifyLoginTwoStep(req, res, next) {
    try {
        const { email, code } = validateBody(verifyAccountDTO, req.body);
        const token = await authService.verifyLoginTwoStep(email, code);
        res.cookie('access_token', token, { httpOnly: true, maxAge: toMs(1, 'hours') });
        res.json({ message: 'User Login Successfully', success: true });
    } catch (error) {
        next(error);
    }
}

export async function enableTwoStep(req, res, next) {
    try {
        await authService.enableTwoStep(req.user.id);
        res.json({ message: 'two step verification enabled', success: true });
    } catch (error) {
        next(error);
    }
}