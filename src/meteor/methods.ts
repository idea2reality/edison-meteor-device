import {ddpClient} from './ddp';

export function applyLed(msgId: string): Promise<any> {
    return new Promise((resolve, reject) =>
        ddpClient.call('applyLed', [msgId], (err, result) => {
            if (err) return reject(err);

            resolve(result);
        }));
}

export function cancelLed(msgId: string, reason): Promise<any> {
    return new Promise((resolve, reject) =>
        ddpClient.call('cancelLed', [msgId, reason], (err, result) => {
            if (err) return reject(err);

            resolve(result);
        }))
}
