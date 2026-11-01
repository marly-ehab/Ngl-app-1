
//loading env variables
import './lib/db/mongoose.js';
import express from 'express';
import cors from "cors";
import {globalErrorHandler} from "./lib/error/error.handler.js";
import {router} from "./route.js";
import {correlationId} from "./pkg/correlation/correlationid.js";
import cookieParser from "cookie-parser";


export function createApp() {
    const app = express();
    app.use(cors({origin: 'http://localhost:4200'}));
    //get static files
    app.use('/uploads',express.static('uploads'));


//parse incoming requests buffer to object
    app.use(express.json());
    app.use(correlationId);

    //parsing cookies
    app.use(cookieParser());
    app.use(correlationId);

    app.get('/health',(req,res,next) => {
        console.log('server is Hit');
        res.json('ok');
    })
    //routes navigate to features
    app.use('/api', router);


    //global error handler
    app.use(globalErrorHandler);

    return app;
}




