import {Led} from './Led';
import {serial} from '../Serial';

export class CC3200Dim extends Led {

    protected value: number[];

    setValue(value: number[]): Promise<any> {
        return serial.write(this.makeProtocol(value));
    }

    makeProtocol(value: number[]): number[] {
        return this.protocFormat.prefix.concat(value, this.protocFormat.postfix);
    }
}
