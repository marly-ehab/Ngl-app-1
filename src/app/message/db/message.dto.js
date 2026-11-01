import { z } from 'zod'
import { Types } from "mongoose";

export const sendMessageDto = z.object({
    content: z.string().trim().min(2).max(100),
    receiver: z.string().trim().refine(
        (val) => Types.ObjectId.isValid(val),
        { message: "Invalid receiver id" }
    )
})

export const objectIdDto = z.string().trim().refine(
    (val) => Types.ObjectId.isValid(val),
    { message: "Invalid id" }
)

export const respondRequestDto = z.object({
    status: z.enum(['accepted', 'rejected']),
})