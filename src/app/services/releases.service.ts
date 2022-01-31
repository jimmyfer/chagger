import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    DocumentReference,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Uploaded } from '../models/models';
import { Releases } from '../models/releases.interface';
import { Workspace, WorkspaceFeatures } from '../models/workspace.interface';
import { FirestoreGenericService } from './firestore-generic.service';
import { WorkspaceService } from './workspace.service';

const collectionPath = 'releases';

@Injectable({
    providedIn: 'root',
})

/**
 * This is the service that handle firestore conections with the releases.
 */
export class ReleasesService extends FirestoreGenericService<Releases> {
    /**
     * Constructor.
     * @param af  Angular helper of Firestore.
     * @param workspaceService Service to handle user workspaces collection in database.
     */
    constructor(
        af: AngularFirestore,
        private workspaceService: WorkspaceService
    ) {
        super(af);
    }

    /**
     * Creates new releases.
     * @param data The relases to be created.
     * @param workspaceId The workspace ID of the release.
     * @returns The document reference of the release.
     */
    async create(
        data: Releases,
        workspaceId: string
    ): Promise<DocumentReference<Releases>> {
        return await this.createDocument(
            data,
            '',
            `workspaces/${workspaceId}/${collectionPath}`
        );
    }

    /**
     * Get a singular release.
     * @param workspaceId Workspace ID.
     * @param releaseId Release ID.
     * @returns Return a release object.
     */
    async getRelease(
        workspaceId: string,
        releaseId: string
    ): Promise<Uploaded<Releases>> {
        return this.getDocument(`workspaces/${workspaceId}/releases`, releaseId)
            .pipe(first())
            .toPromise();
    }

    /**
     * Add new release to Database.
     * @param data New release data.
     * @param workspaceId The actual workspace ID.
     * @param releases The actual releases array in the workspace.
     */
    async addNewRelease(
        data: Releases,
        workspaceId: string,
        releases: Partial<Workspace>
    ): Promise<void> {
        const release = await this.createDocument(
            data,
            '',
            `workspaces/${workspaceId}/${collectionPath}`
        );
        releases.releases?.push({
            version: data.version,
            ref: this.af.doc(`workspaces/${workspaceId}/releases/${release.id}`)
                .ref as DocumentReference,
            emojiId: 'rocket',
            features: [],
        });
        this.workspaceService.editWorkspaceRelease(workspaceId, releases);
    }

    /**
     * Edit the features array in a release document.
     * @param workspaceId Workspace document ID.
     * @param releaseId Release document ID.
     * @param featureData Workspace feature data.
     */
    async editReleaseFeature(
        workspaceId: string,
        releaseId: string,
        featureData: Partial<Releases>
    ): Promise<void> {
        await this.updateDocument(
            featureData,
            `workspaces/${workspaceId}/${collectionPath}`,
            releaseId
        );
    }

    /**
     * Update a release.
     * @param data New release data.
     * @param workspaceReleaseIndex Release index on workspace release array.
     * @param workspaceId Actual workspace ID.
     * @param releaseId Actual release ID.
     * @param releases Releases as Partial<Workspace>.
     */
    async updateRelease(
        data: Releases,
        workspaceReleaseIndex: number,
        workspaceId: string,
        releaseId: string,
        releases: Partial<Workspace>
    ): Promise<void> {
        await this.updateDocument(
            data,
            `workspaces/${workspaceId}/releases`,
            releaseId
        );
        if (releases.releases) {
            releases.releases[workspaceReleaseIndex] = {
                version: data.version,
                ref: releases.releases[workspaceReleaseIndex].ref,
                emojiId: data.emojiId,
                features: data.features,
            };
            this.workspaceService.editWorkspaceRelease(workspaceId, {
                releases: releases.releases,
            });
        }
    }

    /**
     * Delete the selected release.
     * @param releasePath Fullpath of the release.
     * @param workspaceId The actual workspace ID.
     * @param releases The actual releases array in the workspace.
     * @param actualVersion The actual release version.
     */
    async deleteRelease(
        releasePath: string,
        workspaceId: string,
        releases: Partial<Workspace>,
        actualVersion: string
    ): Promise<void> {
        await this.deleteDocument(
            `${releasePath.split('/')[0]}/${releasePath.split('/')[1]}/${
                releasePath.split('/')[2]
            }`,
            releasePath.split('/')[3]
        );
        if (releases.releases) {
            const actualReleaseIndex = releases.releases?.findIndex(
                (release) => release.version == actualVersion
            );
            releases.releases?.splice(actualReleaseIndex, 1);
        } else {
            throw 'There is not Releases!';
        }
        this.workspaceService.editWorkspaceRelease(
            releasePath.split('/')[1],
            releases
        );
    }

    /**
     * Get the features of an espesific release.
     * @param releaseDocumentId Release ID.
     * @param workspaceDocumentId Workspace ID.
     * @returns Return an observable of the features array on release document.
     */
    getReleaseFeatures(
        releaseDocumentId: string,
        workspaceDocumentId: string
    ): Observable<WorkspaceFeatures[]> {
        return this.getDocument(
            `workspaces/${workspaceDocumentId}/${collectionPath}`,
            releaseDocumentId
        ).pipe(map((release) => release.features));
    }
}
