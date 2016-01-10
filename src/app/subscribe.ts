import {subscribeDevices} from './subscribe/device';
import {subscribeDevicesInbox} from './subscribe/inbox';

export function subscribeAll(): Promise<any> {
    return Promise.all([
        subscribeDevices(),
        subscribeDevicesInbox()
    ]);
}
