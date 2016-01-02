import Led from '../Led';
import serial from '../Serial';
// import serial from '../Serial.test';
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
                .then(() => { return serial.write(protoc[1]) })
                .then(resolve)
                .catch((reason) => reject(reason));
        });
    }
}
