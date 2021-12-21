import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { FirestoreGenericService } from './firestore-generic.service';

import { arrayUnion } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Workspace } from '../models/workspace.interface';


const collectionPath: string = 'workspace';

@Injectable({
  providedIn: 'root'
})


export class WorkspaceService extends FirestoreGenericService<Workspace> {

  constructor(af: AngularFirestore) {
    super(af);
  }

  async create(data: Workspace): Promise<DocumentReference<Workspace>> {
    return await this.createDocument(data, '', collectionPath);
  }

  // FIXME
  async addNewWorkspace(data: Workspace, userUid: string): Promise<boolean> {
    let workspace;
    let newdocument;
    workspace = await this.createDocument(data, '', collectionPath);
    newdocument = await this.createDocumentMerge({workspaces: arrayUnion({name: data.name, id: this.af.doc(`workspace/${workspace.id}`).ref})}, userUid, 'users');
    return true;
  }

  getWorkspaceReleases(workspaceDocumentId: string): Observable<Workspace> {
    return this.getDocument(collectionPath, workspaceDocumentId);
  }

}