import { FieldValue } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { Releases } from './releases.interface';
import { User } from './user.interface';

export interface ModelId {
    _docId: string;
}
  
export interface ModelMetadata {
    _creationTime: FieldValue | Timestamp;
    _lastUpdate: FieldValue | Timestamp;
}
  
export declare type Uploaded<T> = T & ModelMetadata;
export declare type Modeled<T> = T & ModelMetadata & ModelId;
export declare type MaybeModeled<T> = T & Partial<ModelMetadata> & Partial<ModelId> & Partial<User> & Partial<Releases>;