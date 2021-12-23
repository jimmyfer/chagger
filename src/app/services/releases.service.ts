import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    DocumentReference,
} from '@angular/fire/compat/firestore';
import { Releases } from '../models/releases.interface';
import { Workspace } from '../models/workspace.interface';
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
    constructor(af: AngularFirestore, private workspaceService: WorkspaceService) {
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
            `workspace/${workspaceId}/${collectionPath}`
        );
    }

    /**
     * Add new release to Database.
     * @param data New release data.
     * @param workspaceId The actual workspace ID.
     * @param releases The actual releases array in the workspace.
     */
    async addNewRelease(data: Releases, workspaceId: string, releases: Partial<Workspace>): Promise<void> {
        const release = await this.createDocument(data,'',`workspace/${workspaceId}/${collectionPath}`);
        releases.releases?.push({version: data.version, id: this.af.doc(`workspace/${workspaceId}/releases/${release.id}`).ref as DocumentReference});
        this.workspaceService.editWorkspaceRelease(workspaceId, releases);
    }

    /**
     * Edit the selected release version.
     * @param newVersion The new release version.
     * @param releasePath Fullpath of the release in the database.
     * @param workspaceId The actual workspace ID.
     * @param actualVersion The actual release version.
     * @param releases The actual releases array in the workspace.
     */
    updateReleaseVersion(newVersion: string, releasePath: string, workspaceId: string, actualVersion: string, releases: Partial<Workspace>): void {
        this.updateDocument({version: newVersion}, `${releasePath.split('/')[0]}/${releasePath.split('/')[1]}/${releasePath.split('/')[2]}`, releasePath.split('/')[3]);
        
        if(releases.releases) {
            const actualReleaseIndex = releases.releases?.findIndex(release => release.version == actualVersion);
            releases.releases?.splice(actualReleaseIndex, 1);
        } else {
            throw 'There is not Releases!';
        }
        
        releases.releases?.push({version: newVersion, id: this.af.doc(`workspace/${workspaceId}/releases/${releasePath.split('/')[3]}`).ref as DocumentReference});
        this.workspaceService.editWorkspaceRelease(releasePath.split('/')[1], releases);
    }

    /**
     * Delete the selected release.
     * @param releasePath Fullpath of the release.
     * @param workspaceId The actual workspace ID.
     * @param releases The actual releases array in the workspace.
     * @param actualVersion The actual release version.
     */
    deleteRelease(releasePath: string, workspaceId: string, releases: Partial<Workspace>, actualVersion: string): void {
        this.deleteDocument(`${releasePath.split('/')[0]}/${releasePath.split('/')[1]}/${releasePath.split('/')[2]}`, releasePath.split('/')[3]);
        if(releases.releases) {
            const actualReleaseIndex = releases.releases?.findIndex(release => release.version == actualVersion);
            releases.releases?.splice(actualReleaseIndex, 1);
        } else {
            throw 'There is not Releases!';
        }
        this.workspaceService.editWorkspaceRelease(releasePath.split('/')[1], releases);
    }
}
