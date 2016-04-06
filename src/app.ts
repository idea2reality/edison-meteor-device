// Set application environments
import {setEnvironments} from './config';
setEnvironments();

// Start application
import * as winston from 'winston';
import {moduleManager} from './led';
import {ddpClient, connect, applyLed, cancelLed, Things} from './meteor';
import {MY_DEVICE_ID, HOST, THINGS_INBOX_COL_NAME} from './config';
import {subscribeAll} from './app/subscribe';

// Startup logic
connect(onConnection)
    .then(() => {
        // Log every ddp message
        ddpClient.on('message', (msg) => winston.verbose("ddp message", msg));

        ddpClient.on('socket-close', (code, message) =>
            winston.info("socket-close", code, message));

        ddpClient.on('socket-error', (error) =>
            winston.error("socket-error", error));
    });

// On connection listener
function onConnection(wasReconnect) {
    if (wasReconnect)
        winston.info('Reconnected');

    winston.info('Connected');

    subscribeAll()
        .then(() => moduleManager.initialize());
}
