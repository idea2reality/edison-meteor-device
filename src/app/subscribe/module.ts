import * as winston from 'winston'
import {ddpClient} from '../../meteor'
import {MODULES_COL_NAME, MODULES_SUB_NAME, MY_DEVICE_ID} from '../../config'


export function subscribeModules(): Promise<any> {
    return new Promise((resolve, reject) => {
        // Watching my inbox
        ddpClient.subscribe(MODULES_SUB_NAME, [MY_DEVICE_ID], resolve);
    })
        .then(() => winston.info('Subscribe', MODULES_COL_NAME))
}
