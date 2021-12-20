import { DocumentReference } from "@angular/fire/compat/firestore";
import { FieldValue } from "firebase/firestore";
import { Timestamp } from 'firebase/firestore';

export interface ModelId {
    _docId: string;
}
  
export interface ModelMetadata {
    _creationTime: FieldValue | Timestamp;
    _lastUpdate: FieldValue | Timestamp;
}

interface Releases {
    releases: {version: string}[]
}
  
export declare type Uploaded<T> = T & ModelMetadata & Releases;
export declare type Modeled<T> = T & ModelMetadata & ModelId & Releases;
export declare type MaybeModeled<T> = T & Partial<ModelMetadata> & Partial<ModelId>;