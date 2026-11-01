import * as messageService from '../service/message.service.js'
import {sendMessageDto, objectIdDto, respondRequestDto} from "../db/message.dto.js";
import { validationBody} from"../../../lib/validation/validation.js"

export async function sendMessage(req, res, next) {

    try{
        //validate data
      const data =  validationBody(sendMessageDto, req.body);
      const {content,receiver} = data;
      const sender = req.user?.id;
        const createdMessage =  await messageService.sendMessage(content,receiver,sender);
      res.status(201).json({
          message:'message created successfully.',
          success:true,
          data:createdMessage,

      })
    }catch(error){
        next(error);
    }
}

export async function getAllMessages(req,res,next){
    try{
        const userId = req.user.id;
      const messages = await  messageService.getAllMessages(userId);
      res.json({
          messages:"OK",
          success:true,
          data:messages,
      });
    }catch(error){
        next(error);
    }
}

//4) Request Sender Identity
export async function requestSenderIdentity(req, res, next) {
    try {
        const messageId = validationBody(objectIdDto, req.params.messageId);
        const request = await messageService.requestSenderIdentity(req.user.id, messageId);
        res.status(201).json({message: 'request created, status pending', success: true, data: request});
    } catch (error) { next(error); }
}

//5) Get Requests
export async function getIdentityRequests(req, res, next) {
    try {
        const requests = await messageService.getIdentityRequests(req.user.id);
        res.json({message: 'OK', success: true, data: requests});
    } catch (error) { next(error); }
}

//6) Accept or Reject Request
export async function respondToIdentityRequest(req, res, next) {
    try {
        const requestId = validationBody(objectIdDto, req.params.requestId);
        const {status} = validationBody(respondRequestDto, req.body);
        const request = await messageService.respondToIdentityRequest(req.user.id, requestId, status);
        res.json({message: `request ${status}`, success: true, data: request});
    } catch (error) { next(error); }
}