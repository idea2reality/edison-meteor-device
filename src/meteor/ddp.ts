import * as winston from 'winston';
import {HOST, PORT} from '../config';
var DDPClient = require('ddp');

export var ddpClient = new DDPClient({
    host: HOST,
    port: PORT,
    ssl: false,
    autoReconnect: true,
    autoReconnectTimer: 500,
    maintainCollections: true,
    ddpVersion: "1",
    useSockJs: true
});

var connectListeners = [];
var connectPromise: Promise<any>;

/*
 * Connect to the Meteor Server
 * Resolved with true return value if it is reconnected
 */
export function connect(connectListener?: (wasReconnect: boolean) => void): Promise<any> {
    if (typeof connectListener === 'function')
        connectListeners.push(connectListener);

    if (connectPromise === undefined)
        connectPromise = new Promise((resolve, reject) => {
            ddpClient.connect((err, wasReconnect) => {
                if (err)
                    return reject(err);

                resolve(wasReconnect);

                for (let listener of connectListeners)
                    listener(wasReconnect);
            });
        });

    return connectPromise;
}
