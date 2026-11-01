import {model, Schema} from 'mongoose'

const identityRequestSchema = new Schema(
    {
        message:  { type: Schema.Types.ObjectId, ref: 'Message', required: true, unique: true },
        receiver: { type: Schema.Types.ObjectId, ref: 'user', required: true },
        sender:   { type: Schema.Types.ObjectId, ref: 'user', required: true },
        status:   { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    },
    { timestamps: true }
)
export const IdentityRequest = model("IdentityRequest", identityRequestSchema)