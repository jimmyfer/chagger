import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    DocumentReference,
} from '@angular/fire/compat/firestore';
import { FirestoreGenericService } from './firestore-generic.service';

import { Observable, of } from 'rxjs';
import { Workspace, WorkspaceFeatures, WorkspaceRelease, WorkspaceTags } from '../models/workspace.interface';
import { UserService } from './user.service';
import { User } from '../models/user.interface';
import { map, switchMap } from 'rxjs/operators';

const collectionPath = 'workspaces';

@Injectable({
    providedIn: 'root',
})

/**
 * Service to handle user workspaces collection in database.
 */
export class WorkspaceService extends FirestoreGenericService<Workspace> {

    workspaces$ = this.userService.user$.pipe(
        switchMap(user => {
            this.userService.email = user && user.email ? user.email : '';
            user ? this.userService.userUid = user.uid : this.userService.userUid = '';
            return user ? this.userService.getUserWorkspaces(user.uid) : of([]) ;
        })
    );


    /**
     *
     * @param af Angular helper of Firestore.
     * @param userService Service to handle user users collection in database.
     */
    constructor(af: AngularFirestore, private userService: UserService) {
        super(af);
    }

    /**
     * Create a new workspace.
     * @param data Workspace data object.
     * @returns Document reference of the workspace created.
     */
    async create(data: Workspace): Promise<DocumentReference<Workspace>> {
        return await this.createDocument(data, '', collectionPath);
    }

    /**
     * Create a new workspace.
     * @param data Workspace data object.
     * @param workSpaces Array of workspaces in user collection.
     */
    async addNewWorkspace(
        data: Workspace,
        workSpaces: Partial<User>
    ): Promise<void> {
        const workspace = await this.createDocument(data, '', collectionPath);
        workSpaces.workspaces?.push({
            name: data.name,
            ref: this.af.doc(`workspaces/${workspace.id}`)
                .ref as DocumentReference,
        });
        this.userService.editUsersWorkspaces(workSpaces);
    }

    /**
     * Create a new workspace in Database.
     * @param data Workspace data.
     */
    async createNewWorkspace(data: Workspace): Promise<boolean> {
        try {
            const workspace = await this.createDocument(
                data,
                '',
                collectionPath
            );
            const workspaces = [
                {
                    name: data.name,
                    ref: this.af.doc(`workspaces/${workspace.id}`)
                        .ref as DocumentReference,
                },
            ];
            await this.userService.createUser(
                { email: this.userService.email, workspaces: workspaces }
            );
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get the releases of an espesific workspace.
     * @param workspaceDocumentId Workspace ID.
     * @returns Return an observable of the workspace releases data.
     */
    getWorkspaceReleases(workspaceDocumentId: string): Observable<WorkspaceRelease[]> {
        return this.getDocument(collectionPath, workspaceDocumentId).pipe(
            map(workspace => workspace.releases));
    }

    /**
     * Get the features of an espesific workspace.
     * @param workspaceDocumentId Workspace ID.
     * @returns Return an observable of the workspace releases data.
     */
    getWorkspaceFeatures(workspaceDocumentId: string): Observable<WorkspaceFeatures[]> {
        return this.getDocument(collectionPath, workspaceDocumentId).pipe(
            map(workspace => workspace.features));
    }

    /**
     * Get the tags of an espesific workspace.
     * @param workspaceDocumentId Workspace ID.
     * @returns Return an observable of the workspace tags data.
     */
    getWorkspaceTags(workspaceDocumentId: string): Observable<WorkspaceTags[]> {
        return this.getDocument(collectionPath, workspaceDocumentId).pipe(
            map(workspace => workspace.tags));
    }

    /**
     * Get the releases of an espesific workspace once.
     * @param workspaceDocumentId Workspace ID.
     * @returns Return an observable of the workspace releases data.
     */
    async getWorkspaceReleasesOnce(workspaceDocumentId: string): Promise<WorkspaceRelease[]> {
        return await this.getFirestoreDocument(collectionPath, workspaceDocumentId).get().pipe(
            map((user) => user.get('releases'))
        ).toPromise();
    }

    /**
     * Get the releases of an espesific workspace once.
     * @param workspaceDocumentId Workspace ID.
     * @returns Return an observable of the workspace releases data.
     */
    async getWorkspaceFeaturesOnce(workspaceDocumentId: string): Promise<WorkspaceRelease[]> {
        return await this.getFirestoreDocument(collectionPath, workspaceDocumentId).get().pipe(
            map((user) => user.get('features'))
        ).toPromise();
    }

    /**
     * Get the releases of an espesific workspace once.
     * @param workspaceDocumentId Workspace ID.
     * @returns Return an observable of the workspace releases data.
     */
    async getWorkspaceTagsOnce(workspaceDocumentId: string): Promise<WorkspaceTags[]> {
        return await this.getFirestoreDocument(collectionPath, workspaceDocumentId).get().pipe(
            map((user) => user.get('tags'))
        ).toPromise();
    }

    /**
     * Get a workspace reference.
     * @param workspaceId Workspace Id.
     * @returns The workspace reference.
     */
    getReference(workspaceId: string ): DocumentReference {
        return this.getFirestoreDocument(collectionPath, workspaceId).ref;
    }

    /**
     * Edit the releases array in a worksapce document.
     * @param workspaceId Workspace document ID.
     * @param releaseData Workspace feature data.
     */
    async editWorkspaceRelease(
        workspaceId: string,
        releaseData: Partial<Workspace>
    ): Promise<void> {
        await this.updateDocument(releaseData, collectionPath, workspaceId);
    }

    /**
     * Edit the features array in a workspace document.
     * @param workspaceId Workspace document ID.
     * @param featureData Workspace feature data.
     */
    async editWorkspaceFeature(
        workspaceId: string,
        featureData: Partial<Workspace>
    ): Promise<void> {
        await this.updateDocument(featureData, collectionPath, workspaceId);
    }

    /**
     * Edit the array releases in workspace.
     * @param tagId Tag id.
     * @param tagData Tag data.
     */
    async editWorkspaceTag(
        tagId: string,
        tagData: Partial<Workspace>
    ): Promise<void> {
        await this.updateDocument(tagData, collectionPath, tagId);
    }
}
