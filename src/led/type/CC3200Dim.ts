import {Led} from './Led';
import {serial} from '../Serial';

export class CC3200Dim extends Led {

    protected value: number[];

    setValue(value: number[]): Promise<any> {
        return serial.write(this.makeProtocol(value));
    }

    makeProtocol(value: number[]): number[] {
        // [02, ID, R, G, B, 03]
        return this.protocFormat.prefix.concat(this.id, value, this.protocFormat.postfix);
    }
}
