import { DocumentReference } from '@angular/fire/compat/firestore';

export interface Workspace {
    name: string;
    releases: WorkspaceRelease[]
}

export interface WorkspaceRelease {
    version: string;
    ref: DocumentReference,
    emojiId: string
}