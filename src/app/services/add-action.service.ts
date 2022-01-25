import {Injectable} from '@angular/core';
import {BehaviorSubject, empty, Observable} from 'rxjs';
import {first} from 'rxjs/operators';
import {Action} from '../models/action';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {UploadTaskSnapshot} from '@angular/fire/compat/storage/interfaces';

@Injectable({
    providedIn: 'root',
})

/**
 * Service to connect to addActionComponent.
 */
export class AddActionService {

    uploadPercent$: Observable<number | undefined> = empty();
    uploadPercent = 0;

    uploadGalleryPercent$: Observable<number | undefined> = empty();

    isAddActionVisible = false;

    featureIndex: number | null = null;

    private releaseActionData = new BehaviorSubject({
        action: {} as Action,
        updateable: false,
    });

    currentReleaseActionData = this.releaseActionData.asObservable();

    private featureActionData = new BehaviorSubject({
        actions: [] as Action[],
        updateable: false,
        featureIndex: null as number | null,
    });
    currentFeatureActionData = this.featureActionData.asObservable();

    /**
     * Constructor.
     */
    constructor(private storage: AngularFireStorage) {
    }

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
                    features.actions[featureIndex] = action;
                    this.featureActionData.next({
                        actions: features.actions,
                        updateable: updateable,
                        featureIndex: featureIndex,
                    });
                });
        } else {
            this.currentFeatureActionData
                .pipe(first())
                .toPromise()
                .then((features) => {
                    features.actions.push(action);
                    this.featureActionData.next({
                        actions: features.actions,
                        updateable: updateable,
                        featureIndex: null,
                    });
                });
        }
    }

    /**
     * Upload a file to firestore.
     * @param dataFile File list.
     */
    async uploadFile(dataFile: FileList): Promise<UploadTaskSnapshot> {
        const file = dataFile[0];
        const filePath = 'actions/action_' + Date.now();
        const task = this.storage.upload(filePath, file);
        this.uploadPercent$ = task.percentageChanges();
        // TODO: add an unsubscribe somewhere
        this.uploadPercent$.subscribe(percent => {
            if (percent) {
                this.uploadPercent = percent;
            }
        });
        return task;
    }

    /**
     * Upload multiples files to firestore.
     * @param files Files list.
     */
    async uploadFiles(files: File[]): Promise<string[]> {
        // const task = this.storage.upload(filePath, file);
        const uploadedFiles: string[] = [];
        return new Promise((resolve, reject) => {
            // TODO: Promise.all([promiseA, promiseB, ...]);
            // FIXME: Promise might resolve before all promises are resolved
            files.forEach((file, index) => {
                // TODO: Add user ID to file path
                const filePath = `image_${index}${Date.now()}`;
                this.storage.upload(filePath, file).then(resp => {
                    console.log(resp.ref.fullPath);
                    uploadedFiles.push(resp.ref.fullPath);
                });
                if (index === files.length - 1) resolve(uploadedFiles);
            });
        });
    }

    /**
     * Return a link to the file.
     * @param filePath File path.
     * @returns Return a link.
     */
    async getDownloadLink(filePath: string): Promise<string> {
        return this.storage.ref(filePath).getDownloadURL().pipe(first()).toPromise();
    }
}
