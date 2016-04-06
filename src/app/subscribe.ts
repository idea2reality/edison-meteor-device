import {subscribeDevices} from './subscribe/device'
import {subscribeDevicesInbox} from './subscribe/inbox'
import {subscribeModules} from './subscribe/module'

export function subscribeAll(): Promise<any> {
    return Promise.all([
        subscribeDevices(),
        subscribeDevicesInbox(),
        subscribeModules()
    ]);
}
