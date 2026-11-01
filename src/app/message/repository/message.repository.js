import {Message} from "../model/message.model.js"

export async function createMessage(content, receiver, sender) {
    return Message.create({
        content: content,
        sender: sender,
        receiver: receiver,
    })

}

export async function getAllMessages(userId) {
    return Message.find({ receiver: userId })
        .populate('sender', 'name')
        .lean();
}

export async function findMessageById(messageId) {
    return Message.findById(messageId);
}