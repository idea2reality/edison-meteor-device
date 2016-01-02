import {HOST, PORT} from '../config';
var DDPClient = require('ddp');

export var ddpClient = new DDPClient({
    // All properties optional, defaults shown
    host: HOST,
    port: PORT,
    ssl: false,
    autoReconnect: true,
    autoReconnectTimer: 500,
    maintainCollections: true,
    ddpVersion: "1", // ["1", "pre2", "pre1"] available,
    // uses the sockJs protocol to create the connection
    // this still uses websockets, but allows to get the benefits
    // from projects like meteorhacks:cluster
    // (load balancing and service discovery)
    // do not use `path` option when you are using useSockJs
    useSockJs: true,
    // Use a full url instead of a set of `host`, `port` and `ssl`
    // do not set `useSockJs` option if `url` is used
    // url: 'wss://example.com/websocket'
});

/*
 * Connect to the Meteor Server
 * Resolved with true return value if it is reconnected
 */
export function startup(): Promise<any> {
    return new Promise((resolve, reject) => {
        ddpClient.connect((err, wasReconnect) => {
            // If autoReconnect is true, this callback will be invoked each time
            // a server connection is re-established
            if (err) {
                reject(err);
                return;
            }

            resolve(wasReconnect);
        });
    });
}
