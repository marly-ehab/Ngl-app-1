import{Router} from "express";
import * as messageController from './controller/message.controller.js'
import {guard} from "../../lib/auth/guard.js";

const messageRouter = Router();
messageRouter.post('/',messageController.sendMessage);
messageRouter.post('/puplic',guard,messageController.sendMessage);
messageRouter.get('/',guard,messageController.getAllMessages);

messageRouter.post('/:messageId/identity-request',guard,messageController.requestSenderIdentity);
messageRouter.get('/identity-requests',guard,messageController.getIdentityRequests);
messageRouter.patch('/identity-requests/:requestId',guard,messageController.respondToIdentityRequest);

export default messageRouter;