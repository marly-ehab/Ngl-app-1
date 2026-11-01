import {IdentityRequest} from "../model/identity-request.model.js";

export async function createRequest(data) {
    return IdentityRequest.create(data);
}
export async function findByMessage(messageId) {
    return IdentityRequest.findOne({message: messageId});
}
export async function findById(requestId) {
    return IdentityRequest.findById(requestId);
}
export async function findBySender(senderId) {
    return IdentityRequest.find({sender: senderId})
        .populate('message', 'content createdAt')
        .populate('receiver', 'name')
        .lean();
}
export async function findByMessageIds(messageIds) {
    return IdentityRequest.find({message: {$in: messageIds}}).lean();
}
export async function updateStatus(requestId, status) {
    return IdentityRequest.findByIdAndUpdate(requestId, {status}, {new: true});
}