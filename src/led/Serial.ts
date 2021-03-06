import {LED as config, DEVELOPMENT_MODE} from '../config';
import * as winston from 'winston';

export var serial: Serial;


var mraa;
var uart;
var SERIAL_PATH;
var SerialPort;

// DEVELOPMENT MODE
if (!DEVELOPMENT_MODE) {
    mraa = require('mraa');
    uart = new mraa.Uart(0);
    SERIAL_PATH = uart.getDevicePath();

    SerialPort = require('serialport').SerialPort;
}

class Serial {
    private serialPort;

    constructor() {
        // DEVELOPMENT MODE
        if (!DEVELOPMENT_MODE)
            this.initialize();
    }

    get isOpen(): boolean {
        // DEVELOPMENT MODE
        if (DEVELOPMENT_MODE)
            return true;

        if (this.serialPort === undefined)
            return false;
        return this.serialPort.isOpen();
    }

    write(protoc: string): Promise<any>
    write(protoc: number[]): Promise<any>
    write(protoc: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.isOpen)
                return reject(new Error('Serial port is NOT available!'));
            var buf;
            // Type guards
            if (typeof protoc === 'string')
                buf = new Buffer(protoc, 'ascii');
            else
                buf = new Buffer(protoc);

            // DEVELOPMENT MODE
            if (DEVELOPMENT_MODE) {
                winston.info('[led] Serial: Written -> ' + protoc);
                resolve();
                return;
            }

            // Write
            this.serialPort.write(buf, (err) => {
                if (err) return reject(err);
                // Waits until all output data has been transmitted to the serial port
                this.serialPort.drain((err) => {
                    if (err) return reject(err);
                    winston.info('[led] Serial: Written -> ' + protoc);
                    resolve();
                });
            })
        });
    }

    private initialize() {
        this.serialPort = new SerialPort(SERIAL_PATH, config.serialportOption);
        this.serialPort.on('open', () =>
            winston.info('Serial port OPEN at', SERIAL_PATH));
        this.serialPort.on('data', (data) =>
            winston.info('[led] Serial: Received -> ' + data));
    }

    /*
     * Static
     */
    private static instance: Serial;

    static getInstance(): Serial {
        if (Serial.instance === undefined)
            Serial.instance = new Serial();

        return Serial.instance;
    }
}

serial = Serial.getInstance();
