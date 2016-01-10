// Set application environments
import {setEnvironments} from './config';
setEnvironments();

// Start application
import * as winston from 'winston';
import {ledManager} from './led';
import {ddpClient, connect, applyLed, cancelLed, Devices} from './meteor';
import {MY_DEVICE_ID, HOST, DEVICES_INBOX_COLLECTION_NAME} from './config';
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
        .then(() => ledManager.initialize());
}

// TODO: DELETE HERE
// On new message in inbox
function onNewMessage(msg) {
    ledManager.setLed(msg.ledId, msg.value)
        .then(() => { return applyLed(msg._id, msg.value) })
        .catch((reason) => { return cancelLed(msg._id, reason) });
}
