import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { FirestoreGenericService } from './firestore-generic.service';


const collectionPath = 'media';

interface Media {
    documentPath: string;
}

@Injectable({
    providedIn: 'root',
})

/**
 * Service to handle media files data.
 */
export class MediaService extends FirestoreGenericService<Media> {

    /**
     * Constructor.
     */
    constructor(protected af: AngularFirestore) {
        super(af);
    }

    /**
     * Creates new media.
     * @param data The media to be created.
     * @param workspaceId The workspace ID of the release.
     * @returns The document reference of the release.
     */
    async create(
        data: Media,
        workspaceId: string
    ): Promise<DocumentReference<Media>> {
        return await this.createDocument(
            data,
            '',
            `workspaces/${workspaceId}/${collectionPath}`
        );
    }
}
