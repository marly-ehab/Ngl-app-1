//schema
import {model, Schema} from "mongoose";

const userSchema = new Schema(
    {
        name:{
            type:String,
            required:true,
            minlength:3,
            maxlength:20,
            trim:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,
        },
        password:{
            type:String,
            required:function (){
                return this.provider === 'local';
            },
        },
        provider: {
            type:String,
            enum: ['local','google','facebook'],
            default:'local'
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        isVerified: {
            type:Boolean,
            default: false
        },
        isBanned: { type: Boolean, default: false },
        isTwoStepEnabled: { type: Boolean, default: false },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        dop:Date,
        gender:{
           type:String,
           enum:['male','female'],
            default:'female'
        },
        profilePicPath: String,
        coverImagePaths:[String],
        cvPath:String,
    },
{
    timestamps: {
        createdAt: true,
        updatedAt: true,
    },
    strict: true
}

)

//model
export const User = model('user',userSchema )