import * as winston from 'winston';
import {MY_DEVICE_ID, LED} from '../config';
import {Led, CC3200, CC3200Dim} from './type';
import {ddpClient} from '../meteor';

export var ledManager: LedManager;

class LedManager {
    private ledMap: Map<string, Led>;

    constructor() {
        this.ledMap = new Map();
    }

    loadLeds(): Promise<any> {
        return new Promise((resolve, reject) =>
            ddpClient.subscribe('device', [MY_DEVICE_ID], () => {
                var leds: any[] = ddpClient.collections.devices[MY_DEVICE_ID].leds;
                for (let led of leds)
                    this.addLed(led)

                resolve();
            }));
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

    private getLed(id: string): Led { return this.ledMap.get(id); }

    setLed(ledId: string, value): Promise<any> {
        return new Promise((resolve, reject) => {
            var led = this.getLed(ledId);

            if (led === undefined)
                return reject(new Error('No such LED'));

            led.setValue(value)
                .then(resolve)
                .catch(reject);
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
