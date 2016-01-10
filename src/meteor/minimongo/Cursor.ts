import * as _ from 'underscore';
import {Collection} from './Collection';
import {ddpClient} from '../ddp';

export class Cursor extends Array {
    collection: Collection;

    constructor(collection, arr?: any[]) {
        super();

        this.collection = collection;

        if (arr)
            for (let element of arr)
                this.push(element);
    }

    observe(callbacks: ObserveCallbacks): any {
        var observer = ddpClient.observe(this.collection.name);

        if (_.has(callbacks, 'added'))
            observer.added = callbacks['added'];
        else observer.added = new Function();

        if (_.has(callbacks, 'changed'))
            observer.changed = callbacks['changed'];
        else observer.changed = new Function();

        if (_.has(callbacks, 'removed'))
            observer.removed = callbacks['removed'];
        else observer.removed = new Function();

        return observer;
    }
}

interface ObserveCallbacks {
    added?: (id) => void;
    changed?: (id, oldFields, clearedFields, newFields) => void;
    removed?: (id, oldValue) => void;
}
