import { Injectable } from '@angular/core';
import { FirestoreGenericService } from './firestore-generic.service';

import { User } from '../models/user.interface'
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

const collectionPath: string = 'users';

@Injectable({
  providedIn: 'root'
})
export class UserService extends FirestoreGenericService<User>{

  userUid: string = '';

  constructor(af: AngularFirestore, private afAuth: AngularFireAuth) {
    super(af)
  }

  async createUser(data: User, id: string): Promise<DocumentReference<User>> {
    return await this.createDocument(data, id, collectionPath);
  }

  getUserWorkspaces(): Observable<User> {
    return this.getDocument(collectionPath, this.userUid);
  }

}