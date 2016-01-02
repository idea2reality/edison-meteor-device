// NodeJS 0.10 version does not support Promise
if (typeof global.Promise === 'undefined')
    global.Promise = require('bluebird');
if (typeof global.Map === 'undefined')
    global.Map = require('hashmap');

import * as winston from 'winston';
winston.level = 'debug';

import {MY_DEVICE_ID, HOST, DEVICES_INBOX_COLLECTION_NAME} from './config';
// import socketManager from './socket.io/socketManager';
// import tempSensor from './sensor/TemperatureSensor';
import ledManager from './led/LedManager';
import {ddpClient, startup} from './meteor/ddp';

// Temperature Sensor
/*
var sendIt = false;

setInterval(() => {
    sendIt = true;
}, 1000);

tempSensor.onRead((data) => {
    // Send log per second
    if (sendIt) {
        var log = { date: new Date(), type: 'temperature', value: data };
        socketManager.sendData(log);
        sendIt = false;
    }
});
*/

// socketManager.onSetLed((ledId, status, ack) =>
//     ledManager.getLed(ledId)
//         .setLed(status)
//         .then(() => ack({ success: 1, error: 0 }))
//         .catch((err: Error) => ack({ success: 0, error: 1, msg: err.message })));

// socketManager.onSetLed((ledId, status, ack) =>
//     ledManager.getLed('CC3200')
//         .setLed(status)
//         .then(() => ack({ success: 1, error: 0 }))
//         .catch((err: Error) => ack({ success: 0, error: 1, msg: err.message })));
startup()
    .then((wasReconnect) => {
        if (wasReconnect) {
            console.log('Reconnected at', new Date().toLocaleTimeString());
        }

        console.log('Connected!');

        /*
         * Watching my inbox
         */
        ddpClient.subscribe('devices.inbox', [MY_DEVICE_ID]);

        /*
         * Observe a collection.
         */
        var observer = ddpClient.observe(DEVICES_INBOX_COLLECTION_NAME);

        observer.added = function(msgId) {
            var msg = ddpClient.collections[DEVICES_INBOX_COLLECTION_NAME][msgId];
            console.log("[ADDED] to " + observer.name + ":  " + msgId);

            ledManager.setLed(msg.ledId, msg.value)
                .then(() => ddpClient.call('applyLed', [msgId, msg.value]))
                .catch((reason) => ddpClient.call('cancelLed', [msgId, reason]))
        };
        observer.changed = function(id, oldFields, clearedFields) {
            console.log("[CHANGED] in " + observer.name + ":  " + id);
            console.log("[CHANGED] old field values: ", oldFields);
            console.log("[CHANGED] cleared fields: ", clearedFields);
        };
        observer.removed = function(id, oldValue) {
            console.log("[REMOVED] in " + observer.name + ":  " + id);
            console.log("[REMOVED] previous value: ", oldValue);
        };
    })
    .then(() => { return ledManager.loadLeds() })
