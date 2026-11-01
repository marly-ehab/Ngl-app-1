import * as userRepository from '../../user/repository/user.repository.js'
import {userNotExist} from "../../user/errors.js";
import * as messageRepository from '../repository/message.repository.js'
import {AppError} from "../../../lib/error/error.js";
import * as identityRequestRepository from '../repository/identity-request.repository.js'

export async function sendMessage(content, receiver, sender) {
    //1.check receiver exists
    const user =await userRepository.findUserById(receiver);
    if (!user) throw userNotExist();
    //2.save massage into db
    return await messageRepository.createMessage(content, receiver, sender);
}

export async function getAllMessages(userId) {
    const messages =await messageRepository.getAllMessages(userId);
    if(messages.length === 0) throw new AppError('no messages found',404);

    //sender stays hidden unless the sender accepted the request
    const requests = await identityRequestRepository.findByMessageIds(messages.map(m => m._id));
    const statusByMessage = new Map(requests.map(r => [String(r.message), r.status]));
    return messages.map(message => {
        const requestStatus = statusByMessage.get(String(message._id)) ?? 'none';
        if (requestStatus !== 'accepted') delete message.sender;
        return {...message, identityRequestStatus: requestStatus};
    });
}

//4) Request Sender Identity
export async function requestSenderIdentity(userId, messageId) {
    const message = await messageRepository.findMessageById(messageId);
    if (!message) throw new AppError('message not found', 404);
    if (String(message.receiver) !== String(userId)) throw new AppError('this message is not yours', 403);
    if (!message.sender) throw new AppError('sender of this message is unknown', 400);
    const existing = await identityRequestRepository.findByMessage(messageId);
    if (existing) throw new AppError(`request already exists (${existing.status})`, 409);
    return await identityRequestRepository.createRequest({
        message: messageId, receiver: userId, sender: message.sender, status: 'pending',
    });
}

//5) Get Requests
export async function getIdentityRequests(userId) {
    return await identityRequestRepository.findBySender(userId);
}

//6) Accept or Reject Request
export async function respondToIdentityRequest(userId, requestId, status) {
    const request = await identityRequestRepository.findById(requestId);
    if (!request) throw new AppError('request not found', 404);
    if (String(request.sender) !== String(userId)) throw new AppError('this request is not yours', 403);
    if (request.status !== 'pending') throw new AppError(`request already ${request.status}`, 409);
    return await identityRequestRepository.updateStatus(requestId, status);
}