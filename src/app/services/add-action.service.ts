import { Injectable } from '@angular/core';
import { Action } from '../models/action';

@Injectable({
    providedIn: 'root',
})

/**
 * Service to connect to addActionComponent.
 */
export class AddActionService {

    isAddActionVisible = false;
    addActionData: Action | null | undefined = null;

    /**
     * Constructor.
     */
    constructor() {}

    /**
     * Make addActionComponent visible.
     */
    callAddAction(): void {
        this.isAddActionVisible = true;
    }
}
