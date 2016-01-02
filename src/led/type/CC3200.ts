import Led from '../Led';
import serial from '../Serial';
import {LED as config} from '../../config';


export default class CC3200 extends Led {

    protected value: boolean;

    constructor(id) {
        super(id, []);
    }

    setValue(status: boolean): Promise<any> {
        var protoc: string[];
        if (status)
            protoc = ['2', '4'];
        else
            protoc = ['1', '3'];

        return new Promise((resolve, reject) => {
            serial.write(protoc[0])
                .then(() =>
                    serial.write(protoc[1])
                        .then(() => resolve())
                        .catch((err) => reject(err)))
                .catch((err) => reject(err));
        });
    }

    setLedOff(): Promise<any> {
        return serial.write(this.getProtoc(false))
            .then(() => { this.value = false; })
    }

    getProtoc(status: boolean) {
        var protoc = this.protocFormat;

        if (status) {
            protoc[4] = 100;
            protoc[5] = 100;
            protoc[6] = 100;
        }
        else {
            protoc[4] = 0;
            protoc[5] = 0;
            protoc[6] = 0;
        }

        return protoc;
    }
}
