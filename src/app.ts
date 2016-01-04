// Set application environments
import {setEnvironments} from './config';
setEnvironments();

// Start application
import * as winston from 'winston';
import {ledManager} from './led';
import {ddpClient, startup, subscribeInbox, applyLed, cancelLed} from './meteor';
import {MY_DEVICE_ID, HOST, DEVICES_INBOX_COLLECTION_NAME} from './config';

// Startup logic
startup(onConnection)
    .then(() => {
        // Log every ddp message
        ddpClient.on('message', (msg) => winston.debug("ddp message", msg));

        ddpClient.on('socket-close', (code, message) =>
            winston.info("socket-close", code, message));

        ddpClient.on('socket-error', (error) =>
            winston.error("socket-error", error));
    })
    .then(() => { return ledManager.loadLeds() })
    .then(() => { return subscribeInbox(onNewMessage) })

// On connection
function onConnection(wasReconnect) {
    if (wasReconnect)
        winston.info('Reconnected');
    winston.info('Connected');
}

// On new message in inbox
function onNewMessage(msg) {
    ledManager.setLed(msg.ledId, msg.value)
        .then(() => { return applyLed(msg._id, msg.value) })
        .catch((reason) => { return cancelLed(msg._id, reason) });
}
