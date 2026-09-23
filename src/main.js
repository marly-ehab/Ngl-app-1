import {config} from 'dotenv'
//loading env variables
config();

import './common/db/mongoose.js';
import express from 'express';
import authRouter from "./app/auth/auth.route.js"
import userRouter from "./app/user/user.route.js"
import messageRouter from "./app/message/message.route.js"
import {otp} from "./app/auth/model/otp.model.js";
import res from "express/lib/response.js";
import req from "express/lib/request.js";

const app = express();
//parse incoming requests buffer to object
app.use(express.json());
//routes navigate to features
app.use('/auth', authRouter);
app.use ('/user', userRouter);
app.use('/message', messageRouter)
//global error handler
app.use((err, req, res, next) => {
    res.status(500).json({
        message: err.message,
        success: false,
        stack: err.stack,
    })
})

app.listen(3000, () => console.log('server started on port 3000'))


