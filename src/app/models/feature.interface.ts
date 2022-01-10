import { Action } from './action';

export interface Feature {
    tag: string,
    description: string,
    action: Action
}