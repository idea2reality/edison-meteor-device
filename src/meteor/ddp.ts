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

/*
 * Connect to the Meteor Server
 * Resolved with true return value if it is reconnected
 */
export function startup(connectListener?: (wasReconnect: boolean) => void): Promise<any> {
    return new Promise((resolve, reject) => {
        ddpClient.connect((err, wasReconnect) => {
            if (err)
                return reject(err);

            connectListener(wasReconnect);
            resolve(wasReconnect);
        });
    });
}
