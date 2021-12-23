import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { FirestoreGenericService } from './firestore-generic.service';

import { Observable } from 'rxjs';
import { Workspace } from '../models/workspace.interface';
import { UserService } from './user.service';
import { User } from '../models/user.interface';


const collectionPath = 'workspace';

@Injectable({
    providedIn: 'root'
})


export class WorkspaceService extends FirestoreGenericService<Workspace> {

    constructor(af: AngularFirestore, private userService: UserService) {
        super(af);
    }

    async create(data: Workspace): Promise<DocumentReference<Workspace>> {
        return await this.createDocument(data, '', collectionPath);
    }

    async addNewWorkspace(data: Workspace, userUid: string, workSpaces: Partial<User>): Promise<void> {
        const workspace = await this.createDocument(data, '', collectionPath);
        workSpaces.workspaces?.push({name: data.name, id: this.af.doc(`workspace/${workspace.id}`).ref as DocumentReference });
        this.userService.editUsersWorkspaces(userUid, workSpaces);
    }

    getWorkspaceReleases(workspaceDocumentId: string): Observable<Workspace> {
        return this.getDocument(collectionPath, workspaceDocumentId);
    }

    editWorkspaceRelease(releaseId: string, releaseData: Partial<Workspace>): void {
        this.updateDocument(releaseData, collectionPath, releaseId);
    }

    

}