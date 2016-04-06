import * as winston from 'winston'
import {MY_DEVICE_ID, LED} from '../config'
import {Led, CC3200, CC3200Dim} from './type'
import {serial} from './Serial'
import {
    Things,
    connect,
    ThingsInbox,
    Modules,
    applyLed,
    cancelLed
} from '../meteor';

class ModuleManager {
    private map: Map<string, any>;

    constructor() {
        this.map = new Map();
    }

    // addLed(data) {
    //     if (data.type === 'cc3200')
    //         this.ledMap.set(data._id, new CC3200(data._id))
    //     else if (data.type === 'cc3200-dim')
    //         this.ledMap.set(data._id, new CC3200Dim(data._id, data.protocol));
    //     else
    //         return winston.error('Unrecognizable LED type: ' + data.type);
    //
    //     winston.info('LED added', this.ledMap.get(data._id).constructor.name, data);
    // }

    loadLeds() {
        winston.info('Loading LEDs...');
        // Clear LED Map
        this.map.clear();
        // Get LED data
        var modules = Modules.find()
        // Add LEDs
        for (let module of modules)
            this.map.set(module._id, module)
    }

    private getLed(id: string) { return this.map.get(id) }

    hasLed(ledId): boolean {
        return this.map.has(ledId);
    }

    setLed(ledId, value): Promise<any> {
        var module = this.getLed(ledId);

        if (module === undefined)
            return Promise.reject(new Error('No such module'));

        module.value = value

        let protoc = new Array(6)

        for(let i = 0; i < protoc.length; i++)
          protoc[i] = ''

        protoc[0] = Things.findOne().protoc.pre
        protoc[5] = Things.findOne().protoc.post

        let i = 0;
        this.map.forEach((m) => {
            let j
            if (i < 8) j = 1
            else if (i < 10) j = 2
            else if (i < 11) j = 3
            else j = 4

            protoc[j] = (m.value ? '1' : '0') + protoc[j]
            i++
        })

        winston.verbose('Converted protocol:' + protoc)

        for (let i = 1; i < 5; i++)
            protoc[i] = Number.parseInt(protoc[i], 2)

        return serial.write(protoc)
    }

    initialize() {
        this.loadLeds();

        Modules.find().observe({
            added: (id) => this.loadLeds(),
            // changed: (id, oldFields, clearedFields, newFields) => {
            //     if (_.has(newFields, 'leds'))
            //         this.loadLeds();
            // }
        });

        ThingsInbox.find().observe({
            added: (id) => {
                var msg = ThingsInbox.findOne(id);

                this.setLed(msg.moduleId, msg.value)
                    .then(() => { return applyLed(msg._id) })
                    .catch((err) => { return cancelLed(msg._id, err.message) })
            }
        });
    }


    private static instance: ModuleManager;

    static getInstance(): ModuleManager {
        if (ModuleManager.instance === undefined)
            ModuleManager.instance = new ModuleManager();

        return ModuleManager.instance;
    }
}

export const moduleManager = ModuleManager.getInstance();
