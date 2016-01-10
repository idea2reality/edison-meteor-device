import * as _ from 'underscore';
import {Cursor} from './Cursor';
import {ddpClient} from '../ddp';

export class Collection {
    name: string;
    data: any;

    constructor(name: string) {
        this.name = name;

        if (ddpClient.collections[name] === undefined)
            ddpClient.collections[name] = {};

        this.data = ddpClient.collections[name];
    }

    find(): Cursor {
        return new Cursor(this, _.values(this.data));
    }

    findOne(_id?: string): any {
        if (_id)
            return this.data[_id];

        return this.data[_.keys(this.data)[0]];
    }
}
