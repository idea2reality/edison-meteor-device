import {ddpClient} from './ddp';
import {DEVICES_INBOX_COLLECTION_NAME, MY_DEVICE_ID} from '../config';

export function subscribeInbox(onNewMessage: (msg: any) => void) {
    return new Promise((resolve, reject) => {
        // Watching my inbox
        ddpClient.subscribe(DEVICES_INBOX_COLLECTION_NAME, [MY_DEVICE_ID], resolve);

        // Observe a collection.
        var observer = ddpClient.observe(DEVICES_INBOX_COLLECTION_NAME);

        observer.added = function(msgId) {
            var msg = ddpClient.collections[DEVICES_INBOX_COLLECTION_NAME][msgId];
            console.log("[ADDED] to " + observer.name + ":  " + msgId);

            onNewMessage(msg);
        }
        observer.changed = function(id, oldFields, clearedFields) {
            console.log("[CHANGED] in " + observer.name + ":  " + id);
            console.log("[CHANGED] old field values: ", oldFields);
            console.log("[CHANGED] cleared fields: ", clearedFields);
        };
        observer.removed = function(id, oldValue) {
            console.log("[REMOVED] in " + observer.name + ":  " + id);
            console.log("[REMOVED] previous value: ", oldValue);
        };
    });
}
