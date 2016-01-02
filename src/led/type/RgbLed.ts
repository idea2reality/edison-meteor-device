import Led from '../Led';
import serial from '../Serial';
import {LED as config} from '../../config';


class RgbLed extends Led {

    protected value: number[];   // RGB

    setValue(rgb: number[]): Promise<any> {
        return serial.write(this.getProtoc(rgb))
            .then(() => { this.value = rgb; })
    }

    setLedOff(): Promise<any> {
        return serial.write(this.getProtoc([0, 0, 0]))
            .then(() => { this.value = [0, 0, 0]; })
    }

    getProtoc(rgb: number[]) {
        var protoc = this.protocFormat;
        protoc[2] = rgb[0];
        protoc[3] = rgb[1];
        protoc[4] = rgb[2];

        return protoc;
    }
}

export default RgbLed;
