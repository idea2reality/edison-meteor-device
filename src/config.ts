export const MY_DEVICE_ID = 'cc3200';
// export const HOST = 'http://edison.idea2r.io/edisons';
export const HOST = 'stwide.idea2r.io';
export const PORT = 80;
export const DEVICES_INBOX_COLLECTION_NAME = 'devices.inbox';
export const DEVICES_INBOX_SUBSCRIVE_NAME = 'devices.inbox';
export const DEVICES_COLLECTION_NAME = 'devices';
export const DEVICES_SUBSCRIBE_NAME = 'device';
export const DEVELOPMENT_MODE = process.env.NODE_ENV === 'development';
export const LED = {
    BASIC_LED_PROTOCOL_FORMAT: [2, 1, 1, 0x10, 0, 0, 0, 84, 3],
    RGB_LED_PROTOCOL_FORMAT: [35, 49, 0, 0, 0, 38],
    serialportOption: {
        baudrate: 9600
    }
};

export function setEnvironments() {
    // Promise
    global.Promise = require('bluebird');
    // Map
    if (typeof global.Map === 'undefined')
        global.Map = require('hashmap');
    // Underscore
        global['_'] = require('underscore');
    // Winston
    var winston = require('winston');

    _.extend(winston.default.transports.console, {
        timestamp: function() { return new Date().toLocaleString() },
        colorize: true
    });

    // winston.level = 'debug';
}
