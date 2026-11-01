//Schema
import {model, Schema} from 'mongoose'
const messageSchema = new Schema(
    {
        content:{
            type:String,
            required:true,
            minLength:1,
            maxLength:200,
            trim:true,
        },
        receiver: {
            type:Schema.Types.ObjectId,
            ref:'user',
            required: true,
        },
        sender:{
            type:Schema.Types.ObjectId,
            ref:'user',
        },
        isDeleted:{
            type:Boolean,
            default:false,
        },
    },
    {
        timestamps:{
            createdAt:true,
            updatedAt:true,
        }
    }
)
//model
export const Message = model("Message", messageSchema)