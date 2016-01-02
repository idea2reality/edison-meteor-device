var mraa = require('mraa');
var uart = new mraa.Uart(0);

export const MY_DEVICE_ID = 'cc3200';
// export const HOST = 'http://edison.idea2r.io/edisons';
export const HOST = 'localhost';
export const PORT = 3000;
export const DEVICES_INBOX_COLLECTION_NAME = 'devices.inbox';
export const SERIAL_PATH = uart.getDevicePath();
export const LED = {
    BASIC_LED_PROTOCOL_FORMAT: [2, 1, 1, 0x10, 0, 0, 0, 84, 3],
    RGB_LED_PROTOCOL_FORMAT: [35, 49, 0, 0, 0, 38],
    serialportOption: {
        baudrate: 9600
    }
};
