import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { first } from 'rxjs/operators';
import { Tags } from '../models/tags.interface';
import { Workspace } from '../models/workspace.interface';
import { FirestoreGenericService } from './firestore-generic.service';
import { WorkspaceService } from './workspace.service';

const collectionPath = 'tags';

@Injectable({
    providedIn: 'root',
})

/**
 * Service to handle tags documents on workspaces collection.
 */
export class TagsService extends FirestoreGenericService<Tags> {

    /**
     * Constructor.
     * @param af  Angular helper of Firestore.
     * @param workspaceService Service to handle user workspaces collection in database.
     */
    constructor(af: AngularFirestore, private workspaceService: WorkspaceService) {
        super(af);
    }

    /**
     * Update a release.
     * @param data New release data.
     * @param actualName Actual tag name.
     * @param workspaceId Actual workspace ID document.
     * @param tagId Actual tag ID document.
     * @param workspace Tags array from the actual workspace.
     */
    updateTag(data: Tags, actualName: string, workspaceId: string, tagId: string, workspace: Partial<Workspace>): void {
        
        this.updateDocument(data, `workspaces/${workspaceId}/tags`, tagId);
        
        if(workspace.tags) {
            const newTags = workspace.tags.map((tag) => {
                if(tag.name == actualName) {
                    tag.name = data.name;
                    tag.emojiId = data.emojiId;
                    tag.color = data.color;
                    return tag;
                }
                return tag;
            });
            this.workspaceService.editWorkspaceRelease(workspaceId, {tags: newTags});
        }
    }

    /**
     * Delete the selected tag.
     * @param tagPath Fullpath of the tag.
     * @param workspaceId The actual workspace ID.
     * @param workspace The actual tags array in the workspace.
     * @param actualName The actual name of the tag.
     */
    deleteTag(tagPath: string, workspaceId: string, workspace: Partial<Workspace>, actualName: string): void {
        this.deleteDocument(`${tagPath.split('/')[0]}/${tagPath.split('/')[1]}/${tagPath.split('/')[2]}`, tagPath.split('/')[3]);
        if(workspace.tags) {
            const actualTagIndex = workspace.tags?.findIndex(tag => tag.name == actualName);
            workspace.tags?.splice(actualTagIndex, 1);
        } else {
            throw 'There is not Tags!';
        }
        this.workspaceService.editWorkspaceRelease(tagPath.split('/')[1], workspace);
    }

    /**
     * Add new release to Database.
     * @param data New release data.
     * @param workspaceId The actual workspace ID.
     * @param workspace The actual releases array in the workspace.
     */
    async addNewTag(data: Tags, workspaceId: string, workspace: Partial<Workspace>): Promise<void> {
        const tag = await this.createDocument(data,'',`workspaces/${workspaceId}/${collectionPath}`);
        workspace.tags?.push({name: data.name, ref: this.af.doc(`workspaces/${workspaceId}/releases/${tag.id}`).ref as DocumentReference, emojiId: data.emojiId, color: data.color});
        this.workspaceService.editWorkspaceRelease(workspaceId, workspace);
    }

    /**
     * Get a tag.
     * @param workspaceId Workspace ID.
     * @param tagId Tag ID.
     * @returns Return a release object.
     */
    async getTag(workspaceId: string, tagId: string): Promise<Tags> {
        return this.getDocument(`workspaces/${workspaceId}/tags`, tagId).pipe(first()).toPromise();
    }
}