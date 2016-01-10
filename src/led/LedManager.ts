import * as winston from 'winston';
import {MY_DEVICE_ID, LED} from '../config';
import {Led, CC3200, CC3200Dim} from './type';
import {Devices, connect, DevicesInbox, applyLed, cancelLed} from '../meteor';

export var ledManager: LedManager;

class LedManager {
    private ledMap: Map<string, Led>;

    constructor() {
        this.ledMap = new Map();
    }

    addLed(data) {
        if (data.type === 'cc3200')
            this.ledMap.set(data._id, new CC3200(data._id))
        else if (data.type === 'cc3200-dim')
            this.ledMap.set(data._id, new CC3200Dim(data._id, data.protocol));
        else
            console.error('Unrecognizable LED type: ' + data.type);

        winston.info('LED added', this.ledMap.get(data._id).constructor.name, data);
    }

    loadLeds() {
        winston.info('Loading LEDs...');
        // Clear LED Map
        this.ledMap.clear();
        // Get LED data
        var leds: any[] = Devices.findOne().leds;
        // Check data
        if (!_.isArray(leds))
            return;
        // Add LEDs
        for (let led of leds)
            this.addLed(led);
    }

    private getLed(id: string): Led { return this.ledMap.get(id); }

    hasLed(ledId): boolean {
        return this.ledMap.has(ledId);
    }

    setLed(ledId, value): Promise<any> {
        return new Promise((resolve, reject) => {
            var led = this.getLed(ledId);

            if (led === undefined)
                return reject(new Error('No such LED'));

            led.setValue(value)
                .then(resolve)
                .catch(reject);
        });
    }

    initialize() {
        this.loadLeds();

        Devices.find().observe({
            added: (id) => this.loadLeds(),
            changed: (id, oldFields, clearedFields, newFields) => {
                if (_.has(newFields, 'leds'))
                    this.loadLeds();
            }
        });

        DevicesInbox.find().observe({
            added: (id) => {
                var msg = DevicesInbox.findOne(id);

                this.setLed(msg.ledId, msg.value)
                    .then(() => { return applyLed(msg._id, msg.value) })
                    .catch((reason) => { return cancelLed(msg._id, reason) });
            }
        });
    }


    private static instance: LedManager;

    static getInstance(): LedManager {
        if (LedManager.instance === undefined)
            LedManager.instance = new LedManager();

        return LedManager.instance;
    }
}

ledManager = LedManager.getInstance();
