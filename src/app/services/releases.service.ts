import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    DocumentReference,
} from '@angular/fire/compat/firestore';
import { arrayUnion, FieldValue } from '@angular/fire/firestore';
import { Releases } from '../models/releases.interface';
import { FirestoreGenericService } from './firestore-generic.service';

const collectionPath: string = 'releases';

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
        this.createDocumentMerge({version: newVersion}, releasePath.split("/")[3], `${releasePath.split("/")[0]}/${releasePath.split("/")[1]}/${releasePath.split("/")[2]}`);
        let actualReleaseIndex;
        actualReleaseIndex = releasesContainer.findIndex(release => release.version == actualVersion);
        releasesContainer.splice(actualReleaseIndex, 1);
        releasesContainer.push({version: newVersion, id: this.af.doc(`workspace/${workspaceId}/releases/${releasePath.split("/")[3]}`).ref as DocumentReference})
        this.createDocumentMerge(
            {
                releases: releasesContainer,
            },
            workspaceId,
            `workspace`
        );
    }

    deleteRelease(releasePath: string, workspaceId: string, releasesContainer: {version: string, id: DocumentReference}[], actualVersion: string): void {
        this.deleteDocument(`${releasePath.split("/")[0]}/${releasePath.split("/")[1]}/${releasePath.split("/")[2]}`, releasePath.split('/')[3]);
        let actualReleaseIndex;
        actualReleaseIndex = releasesContainer.findIndex(release => release.version == actualVersion);
        releasesContainer.splice(actualReleaseIndex, 1);
        this.createDocumentMerge(
            {
                releases: releasesContainer,
            },
            workspaceId,
            `workspace`
        );
    }
}
