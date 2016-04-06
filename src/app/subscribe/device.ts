import * as winston from 'winston';
import * as _ from 'underscore';
import {ddpClient} from '../../meteor';
import {THINGS_INBOX_COL_NAME, MY_DEVICE_ID, THINGS_SUB_NAME} from '../../config';
import {moduleManager} from '../../led';

export function subscribeDevices(): Promise<any> {
    return new Promise((resolve, reject) => {
        // Watching my inbox
        ddpClient.subscribe(THINGS_SUB_NAME, [MY_DEVICE_ID], resolve);
    })
        .then(() => winston.info('Subscribe', THINGS_SUB_NAME))
}
