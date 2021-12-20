import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    DocumentReference,
} from '@angular/fire/compat/firestore';
import { arrayRemove, arrayUnion, FieldValue } from '@angular/fire/firestore';
import { first } from 'rxjs/operators';
import { FirestoreGenericService } from './firestore-generic.service';

const collectionPath: string = 'releases';

interface Releases {
    releases?: FieldValue | {version: string, id: DocumentReference}[];
    version?: string;
    description?: string;
    id?: DocumentReference;
}

@Injectable({
    providedIn: 'root',
})
export class ReleasesService extends FirestoreGenericService<Releases> {
    constructor(af: AngularFirestore) {
        super(af);
    }

    async create(
        data: Releases,
        workspaceId: string
    ): Promise<DocumentReference<Releases>> {
        return await this.createDocument(
            data,
            '',
            `workspace/${workspaceId}/${collectionPath}`
        );
    }

    async addNewRelease(data: Releases, workspaceId: string): Promise<boolean> {
        let release;
        let newdocument;
        release = await this.createDocument(
            data,
            '',
            `workspace/${workspaceId}/${collectionPath}`
        );
        newdocument = this.createDocumentMerge(
            {
                releases: arrayUnion({
                    version: data.version,
                    id: this.af.doc(
                        `workspace/${workspaceId}/releases/${release.id}`
                    ).ref,
                }),
            },
            workspaceId,
            `workspace`
        );
        return true;
    }

    updateRelease(newVersion: string, releasePath: string, workspaceId: string, actualVersion: string, releasesContainer: {version: string, id: DocumentReference}[]): void {
        console.log(releasePath.split("/"))
        console.log(releasePath)
        this.createDocumentMerge({version: newVersion}, releasePath.split("/")[3], `${releasePath.split("/")[0]}/${releasePath.split("/")[1]}/${releasePath.split("/")[2]}`);
        let actualReleaseIndex;
        actualReleaseIndex = releasesContainer.findIndex(release => release.version == actualVersion);
        releasesContainer.splice(actualReleaseIndex, 1);
        releasesContainer.push({version: newVersion, id: this.af.doc(`workspace/${workspaceId}/releases/${releasePath.split("/")[0]}`).ref as DocumentReference})
        this.createDocumentMerge(
            {
                releases: releasesContainer,
            },
            workspaceId,
            `workspace`
        );
    }
}
