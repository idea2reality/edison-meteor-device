import * as winston from 'winston';
import {ddpClient} from './ddp';
import {DEVICES_INBOX_COLLECTION_NAME, MY_DEVICE_ID} from '../config';

export function subscribeInbox(onNewMessage: (msg: any) => void) {
    return new Promise((resolve, reject) => {
        // Watching my inbox
        ddpClient.subscribe(DEVICES_INBOX_COLLECTION_NAME, [MY_DEVICE_ID], resolve);

        // Observe a collection.
        var observer = ddpClient.observe(DEVICES_INBOX_COLLECTION_NAME);
        // Register listeners
        observer.added = onAdd;
        observer.changed = onChange;
        observer.removed = onRemove;

        function onAdd(msgId) {
            var msg = ddpClient.collections[DEVICES_INBOX_COLLECTION_NAME][msgId];
            winston.verbose('Added to (%s)', observer.name, msg);

            onNewMessage(msg);
        }

        function onChange(id, oldFields, clearedFields) {
            winston.verbose('Changed in (%s)', observer.name, id)
        };

        function onRemove(id, oldValue) {
            winston.verbose('Removed from (%s)', observer.name, oldValue);
        };
    });
}
