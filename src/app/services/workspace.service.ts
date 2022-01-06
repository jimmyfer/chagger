import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    DocumentReference,
} from '@angular/fire/compat/firestore';
import { FirestoreGenericService } from './firestore-generic.service';

import { Observable } from 'rxjs';
import { Workspace, WorkspaceRelease } from '../models/workspace.interface';
import { UserService } from './user.service';
import { User } from '../models/user.interface';
import { map } from 'rxjs/operators';

const collectionPath = 'workspaces';

@Injectable({
    providedIn: 'root',
})

/**
 * Service to handle user workspaces collection in database.
 */
export class WorkspaceService extends FirestoreGenericService<Workspace> {

    userUid: string;

    /**
     *
     * @param af Angular helper of Firestore.
     * @param userService Service to handle user users collection in database.
     */
    constructor(af: AngularFirestore, private userService: UserService) {
        super(af);
        this.userUid = this.userService.userUid;
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
            this.userService.createUser(
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
     * Get a workspace reference.
     * @param workspaceId Workspace Id.
     * @returns The workspace reference.
     */
    getReference(workspaceId: string ): DocumentReference {
        return this.getFirestoreDocument(collectionPath, workspaceId).ref;
    }

    /**
     * Edit the array releases in workspace.
     * @param releaseId FIXME
     * @param releaseData FIXME
     */
    editWorkspaceRelease(
        releaseId: string,
        releaseData: Partial<Workspace>
    ): void {
        this.updateDocument(releaseData, collectionPath, releaseId);
    }
}
