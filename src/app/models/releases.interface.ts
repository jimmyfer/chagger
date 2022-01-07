import { Action } from './action';

export interface Releases {
    version: string;
    description: string;
    action?: Action;
    emojiId: string;
}