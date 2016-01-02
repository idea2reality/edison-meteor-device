// NodeJS 0.10 version does not support Promise
if (typeof global.Promise === 'undefined')
    global.Promise = require('bluebird');
if (typeof global.Map === 'undefined')
    global.Map = require('hashmap');

import * as winston from 'winston';
winston.level = 'debug';

import {MY_DEVICE_ID, HOST, DEVICES_INBOX_COLLECTION_NAME} from './config';
import ledManager from './led/LedManager';
import {ddpClient, startup, subscribeInbox, applyLed, cancelLed} from './meteor';

startup()
    .then((wasReconnect) => {
        if (wasReconnect) {
            console.log('Reconnected at', new Date().toLocaleTimeString());
        }

        console.log('Connected!');
    })
    .then(() => { return ledManager.loadLeds() })
    .then(() => { return subscribeInbox(onNewMessage) })

function onNewMessage(msg) {
    ledManager.setLed(msg.ledId, msg.value)
        .then(() => { return applyLed(msg._id, msg.value) })
        .catch((reason) => {console.log(reason); return cancelLed(msg._id, reason) });
}
