import * as winston from 'winston';
import * as _ from 'underscore';
import {ddpClient} from '../../meteor';
import {DEVICES_INBOX_COLLECTION_NAME, MY_DEVICE_ID, DEVICES_INBOX_SUBSCRIVE_NAME} from '../../config';
import {ledManager} from '../../led';

export function subscribeDevicesInbox(onNewMessage?: (msg: any) => void): Promise<any> {
    if (typeof onNewMessage !== 'function')
        onNewMessage = function() { }

    return new Promise((resolve, reject) => {
        // Watching my inbox
        ddpClient.subscribe(DEVICES_INBOX_SUBSCRIVE_NAME, [MY_DEVICE_ID], resolve);
    })
        .then(() => winston.info('Subscribe', DEVICES_INBOX_COLLECTION_NAME))
}
