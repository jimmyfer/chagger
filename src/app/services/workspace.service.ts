import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { FirestoreGenericService } from './firestore-generic.service';

import { Workspace } from '../models/workspace.interface';
import { AngularFireAuth } from '@angular/fire/compat/auth';


const collectionPath: string = 'workspace';

@Injectable({
  providedIn: 'root'
})


export class WorkspaceService extends FirestoreGenericService<Workspace> {

  constructor(af: AngularFirestore, private afAuth: AngularFireAuth) {
    super(af);
  }

  async create(data: Workspace): Promise<DocumentReference<Workspace>> {
    return await this.createDocument(data, '', collectionPath);
  }

  async addNewWorkspace(data: Workspace): Promise<DocumentReference<Workspace>> {
    return await this.createDocument(data, '', collectionPath);
  }

}