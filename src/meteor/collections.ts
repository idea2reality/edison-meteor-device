import { Collection } from './minimongo';
import {
    THINGS_COL_NAME,
    THINGS_INBOX_COL_NAME,
    MODULES_COL_NAME
} from '../config';

export const Things = new Collection(THINGS_COL_NAME);
export const ThingsInbox = new Collection(THINGS_INBOX_COL_NAME);
export const Modules = new Collection(MODULES_COL_NAME)
