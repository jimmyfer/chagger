import { Injectable } from '@angular/core';
import { ImagesGallery } from '../models/models';
import { FirestoreStorageService } from './firestore-storage.service';

@Injectable({
    providedIn: 'root',
})

/**
 * Service that handle gallery.
 */
export class GalleryService {
    isGalleryVisible = false;

    images: ImagesGallery[] = [];

    /**
     * Constructor.
     */
    constructor(private firestoreStorage: FirestoreStorageService) {}

    /**
     * Set images.
     * @param filesPaths Files url paths.
     */
    setImages(filesPaths: string[]): void {
        this.firestoreStorage.getUrlImages(filesPaths).then((imagesURL) => {
            this.images = [];
            imagesURL.map((imageURL) => {
                this.images.push({
                    previewImageSrc: imageURL,
                    thumbnailImageSrc: imageURL,
                });
            });
            console.log(this.images);
        });
    }
}
