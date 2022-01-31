import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { MediaService } from './media.service';

@Injectable({
    providedIn: 'root',
})

/**
 * Service to handle firestore storage.
 */
export class FirestoreStorageService {
    /**
     * Constructor.
     */
    constructor(
        private storage: AngularFireStorage,
        private mediaService: MediaService
    ) {}

    /**
     * Upload a file to firestore.
     * @param dataFile File list.
     * @param workspaceId The workspace ID of the media.
     */
    async uploadFile(
        dataFile: FileList,
        workspaceId: string
    ): Promise<[Observable<number | undefined>, string]> {
        const file = dataFile[0];
        const filePath = 'actions/action_' + Date.now();
        const task = this.storage.upload(filePath, file);
        this.mediaService.create({
            documentPath: filePath
        }, workspaceId);
        return [task.percentageChanges(), filePath];
    }

    /**
     * Upload multiples files to firestore.
     * @param files Files list.
     * @param userUid User uid.
     * @param workspaceId The workspace ID of the media.
     */
    async uploadFiles(
        files: File[],
        userUid: string,
        workspaceId: string
    ): Promise<[Observable<number | undefined>[], string[]]> {
        const paths: string[] = [];
        const observables = files.map((file, index) => {
            const filePath = `images/image_${userUid}_${index}${Date.now()}`;
            paths.push(filePath);
            this.mediaService.create({
                documentPath: filePath
            }, workspaceId);
            return this.storage.upload(filePath, file).percentageChanges();
        });
        return [observables, paths];
    }

    /**
     * Get an array of url images.
     * @param imagesPaths Images paths on firebase store.
     */
    async getUrlImages(imagesPaths: string[]): Promise<string[]> {
        return await Promise.all(imagesPaths.map(imagePath => {
            return this.storage.ref(imagePath).getDownloadURL().pipe(first()).toPromise();
        })).then(imagesUrl => {
            return imagesUrl;
        });
    }
}
