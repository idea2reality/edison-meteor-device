export const MY_DEVICE_ID = 'edison'
// export const HOST = 'http://edison.idea2r.io/edisons';
export const HOST = 'localhost'
export const PORT = 3000
export const THINGS_INBOX_COL_NAME = 'things.inbox'
export const THINGS_INBOX_SUB_NAME = 'myInbox'
export const THINGS_COL_NAME = 'things'
export const THINGS_SUB_NAME = 'things'
export const MODULES_COL_NAME = 'modules'
export const MODULES_SUB_NAME = 'modules'
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

    winston.level = 'debug';
}
