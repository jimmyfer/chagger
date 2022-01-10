import { DocumentReference } from '@angular/fire/compat/firestore';
import { Action } from './action';

export interface Workspace {
    name: string;
    releases: WorkspaceRelease[];
    tags: WorkspaceTags[];
    features: WorkspaceFeatures[];
}

export interface WorkspaceRelease {
    version: string;
    ref: DocumentReference;
    emojiId: string;
    features: WorkspaceFeatures[];
}

export interface WorkspaceTags {
    name: string;
    emojiId: string;
    ref: DocumentReference;
    color: string;
}

export interface WorkspaceFeatures {
    description: string;
    tag: string;
    ref: DocumentReference;
}