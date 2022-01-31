import { Injectable } from '@angular/core';
import { BehaviorSubject, empty, Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { Action } from '../models/action';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UploadTaskSnapshot } from '@angular/fire/compat/storage/interfaces';
import { FirestoreStorageService } from './firestore-storage.service';

@Injectable({
    providedIn: 'root',
})

/**
 * Service to connect to addActionComponent.
 */
export class AddActionService {
    uploadPercent$: Observable<number | undefined> = empty();
    uploadPercent = 0;

    uploadFilesPercent$: Observable<number | undefined> = empty();
    uploadFilesPercent = 0;

    uploadGalleryPercent$: Observable<number | undefined> = empty();

    isAddActionVisible = false;

    featureIndex: number | null = null;

    private releaseActionData = new BehaviorSubject({
        action: {} as Action,
        updateable: false,
    });

    currentReleaseActionData = this.releaseActionData.asObservable();

    private featureActionData = new BehaviorSubject({
        action: {} as Action,
        updateable: false,
        featureIndex: null as number | null,
    });
    currentFeatureActionData = this.featureActionData.asObservable();

    /**
     * Constructor.
     */
    constructor(private storage: AngularFireStorage, private firestoreStorage: FirestoreStorageService) {}

    /**
     * Make addActionComponent visible.
     * @param featureIndex Feature Index.
     */
    callAddAction(featureIndex: number | null): void {
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
            updateable: updateable,
        });
    }

    /**
     * Update the actual feature action.
     * @param action Action data.
     * @param updateable Check if need to be updated the action in document.
     * @param featureIndex Feature index.
     */
    updateFeatureActionData(
        action: Action,
        updateable: boolean,
        featureIndex?: number
    ) {
        if (featureIndex != null && featureIndex >= 0) {
            this.currentFeatureActionData
                .pipe(first())
                .toPromise()
                .then((features) => {
                    features.action = action;
                    this.featureActionData.next({
                        action: features.action,
                        updateable: updateable,
                        featureIndex: featureIndex,
                    });
                });
        } else {
            this.currentFeatureActionData
                .pipe(first())
                .toPromise()
                .then((features) => {
                    features.action = action;
                    this.featureActionData.next({
                        action: features.action,
                        updateable: updateable,
                        featureIndex: null,
                    });
                });
        }
    }

    /**
     * Upload a file to firestore.
     * @param dataFile File list.
     * @param workspaceId The workspace ID.
     */
    async uploadActionFile(dataFile: FileList, workspaceId: string): Promise<string> {
        const [data, refPath] = (await this.firestoreStorage.uploadFile(dataFile, workspaceId));
        this.uploadPercent$ = data;
        // FIXME unsuscribe
        this.uploadPercent$.subscribe(percent => {
            if(percent) {
                this.uploadPercent = percent;
            }
        });
        return refPath;
    }

    /**
     * Upload multiples files to firestore.
     * @param files Files list.
     * @param userUid User uid.
     * @param workspaceId The workspace ID.
     */
    async uploadFiles(files: File[], userUid: string, workspaceId: string): Promise<string[]> {
        const promUploadpercent: number[] = [];
        for (let index = 0; index < files.length; index++) {
            promUploadpercent.push(0);
        }

        const [observables, paths] = (await this.firestoreStorage.uploadFiles(files, userUid, workspaceId));
        observables.map((percentObs, index) => {
            percentObs.subscribe(percent => {
                if(percent) {
                    let total = 0;
                    promUploadpercent[index] = Math.round(percent) / observables.length;
                    promUploadpercent.map(individualPercent => total += individualPercent);
                    this.uploadFilesPercent = total;
                }
            });
        });
        return paths;
    }

    /**
     * Return a link to the file.
     * @param filePath File path.
     * @returns Return a link.
     */
    async getDownloadLink(filePath: string): Promise<string> {
        return this.storage
            .ref(filePath)
            .getDownloadURL()
            .pipe(first())
            .toPromise();
    }
}
