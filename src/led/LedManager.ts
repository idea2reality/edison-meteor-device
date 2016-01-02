import {MY_DEVICE_ID, LED} from '../config';
import RgbLed from './type/RgbLed';
import BasicLed from './type/BasicLed';
import CC3200 from './type/CC3200';
import Led from './Led';
import {ddpClient} from '../meteor';

class LedManager {
    private ledMap: Map<string, Led>;

    constructor() {
        this.ledMap = new Map();
    }

    loadLeds(): Promise<any> {
        return new Promise((resolve, reject) =>
            ddpClient.subscribe('device', [MY_DEVICE_ID],
                function() {
                    var leds: any[] = ddpClient.collections.devices[MY_DEVICE_ID].leds;
                    for (let led of leds) {
                        if (led.type == 'rgb')
                            this.ledMap.set(led.id, new RgbLed(led.id, LED.RGB_LED_PROTOCOL_FORMAT));
                        if (led.type == 'basic')
                            this.ledMap.set(led.id, new BasicLed(led.id, LED.BASIC_LED_PROTOCOL_FORMAT));
                        if (led.type == 'cc3200')
                            this.ledMap.set(led.id, new CC3200(led.id))
                    }

                    resolve();
                }));
    }

    getLed(id: string): Led { return this.ledMap.get(id); }

    setLed(ledId: string, value): Promise<any> {
        return new Promise((resolve, reject) => {
            var led = this.getLed(ledId);

            if (led === undefined)
                reject(new Error('No such LED'));

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

export default LedManager.getInstance();
