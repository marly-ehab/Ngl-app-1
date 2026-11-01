import http from "http";
import {createApp} from "./app.js";
import mongoose from "mongoose";
import {env} from "./lib/config/env.js";
import {logger} from "./pkg/logger/logger.js";

const app = createApp();
const server = http.createServer(app);

server.listen(3001, () => logger.info('server started on port 30001' ));

async function shutdown() {
   server.close(async () => {
       await mongoose.disconnect();
       process.exit(0);
   });
}
process.on('SIGNIT', shutdown);
process.on('SIGTERM',shutdown);

