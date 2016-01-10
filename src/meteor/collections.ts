import {Collection} from './minimongo';
import {DEVICES_COLLECTION_NAME, DEVICES_INBOX_COLLECTION_NAME} from '../config';

export var Devices = new Collection(DEVICES_COLLECTION_NAME);

export var DevicesInbox = new Collection(DEVICES_INBOX_COLLECTION_NAME);
