import * as winston from 'winston';
import * as _ from 'underscore';
import {ddpClient} from '../../meteor';
import {DEVICES_INBOX_COLLECTION_NAME, MY_DEVICE_ID, DEVICES_SUBSCRIBE_NAME} from '../../config';
import {ledManager} from '../../led';

export function subscribeDevices(): Promise<any> {
    return new Promise((resolve, reject) => {
        // Watching my inbox
        ddpClient.subscribe(DEVICES_SUBSCRIBE_NAME, [MY_DEVICE_ID], resolve);
    })
        .then(() => winston.info('Subscribe', DEVICES_SUBSCRIBE_NAME))
}
