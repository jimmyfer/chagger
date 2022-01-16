import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { Action } from '../models/action';
import { FeaturesService } from './features.service';

@Injectable({
    providedIn: 'root',
})

/**
 * Service to connect to addActionComponent.
 */
export class AddActionService {

    isAddActionVisible = false;

    featureIndex: number | null = null;

    private releaseActionData = new BehaviorSubject({
        action: {} as Action,
        updateable: false
    });
    
    currentReleaseActionData = this.releaseActionData.asObservable();

    private featureActionData = new BehaviorSubject({
        actions: [] as Action[],
        updateable: false,
        featureIndex: null as number | null
    });
    currentFeatureActionData = this.featureActionData.asObservable();

    /**
     * Constructor.
     */
    constructor(private featureService: FeaturesService) {}

    /**
     * Make addActionComponent visible.
     * @param featureIndex Feature Index.
     */
    callAddAction( featureIndex: number | null ): void {
        this.featureIndex = featureIndex;
        this.isAddActionVisible = true;
    }

    /** 
    * Update the actual release action.
    * @param action Action data.
    * @param updateable Check if need to be updated the action in document.
    */
    updateReleaseActionData(action: Action, updateable: boolean) {
        this.releaseActionData.next({
            action: action,
            updateable: updateable
        });
    }

    /** 
    * Update the actual feature action.
    * @param action Action data.
    * @param updateable Check if need to be updated the action in document.
    * @param featureIndex Feature index.
    */
    updateFeatureActionData(action: Action, updateable: boolean, featureIndex?: number) {
        if(featureIndex != null && featureIndex >= 0){ 
            this.currentFeatureActionData.pipe(first()).toPromise().then( features => {
                features.actions[featureIndex] = action;
                this.featureActionData.next({
                    actions: features.actions,
                    updateable: updateable,
                    featureIndex: featureIndex
                });
            } );
        }else {
            this.currentFeatureActionData.pipe(first()).toPromise().then( features => {
                features.actions.push(action);
                this.featureActionData.next({
                    actions: features.actions,
                    updateable: updateable,
                    featureIndex: null
                });
            } );
        }
        
    }
}
