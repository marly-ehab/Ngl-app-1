import { z } from "zod";

export const registerDTO = z.object({
    email: z.email({message:"invalid email formate"}).toLowerCase().trim(),
    name: z.string().min(2).max(20).trim(),
    password: z.string().min(8).max(20).trim(),
    provider: z.enum(['local', 'google', 'facebook']).default('local'),
    dob: z.date().optional(),
    gender: z.enum(['male', 'female']).optional(),
})

export const verifyAccountDTO = z.object({
    email: z.email().toLowerCase().trim(),
    code: z.string().min(6).max(6).trim(),
});

export const loginDTO = z.object({
    email: z.email().toLowerCase().trim(),
    password: z.string().min(4).max(20).trim(),
});

export const sentOTPDto = z.object({
    email: z.email().toLowerCase().trim(),
});

export const resetPasswordDTO = z.object({
    email: z.email().toLowerCase().trim(),
    code: z.string().length(6).trim(),
    newPassword: z.string().min(8).max(20).trim(),
});
