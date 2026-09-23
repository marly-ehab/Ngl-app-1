//Schema
import {model, Schema} from 'mongoose';

const otpSchema = new Schema(
    {
        code:{type:String, required:true, length:6,},
        email:{type:String, required:true, lowercase:true, trim:true},
        expiresAt:{type:Date, required:true, index:{expires: 0}},
    },
    {
        timestamps:{
            createdAt: true,
            updatedAt: false,
        }
    }
)
//model
export const otp = model('otp', otpSchema);