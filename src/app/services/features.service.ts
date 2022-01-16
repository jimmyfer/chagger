import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    DocumentReference,
} from '@angular/fire/compat/firestore';
import { first } from 'rxjs/operators';
import { Feature } from '../models/feature.interface';
import { Workspace, WorkspaceFeatures } from '../models/workspace.interface';
import { FirestoreGenericService } from './firestore-generic.service';
import { ReleasesService } from './releases.service';
import { WorkspaceService } from './workspace.service';

const collectionPath = 'features';

@Injectable({
    providedIn: 'root',
})

/**
 * Service that handle features conections in the database.
 */
export class FeaturesService extends FirestoreGenericService<Feature> {
    /**
     * Constructor.
     * @param af  Angular helper of Firestore.
     * @param workspaceService Service to handle user workspaces collection in database.
     */
    constructor(
        af: AngularFirestore,
        private workspaceService: WorkspaceService,
        private releasesService: ReleasesService
    ) {
        super(af);
    }

    /**
     * Create a new feature in the database.
     * @param workspaceId Workspace ID.
     * @param releaseId Release ID.
     * @param features Features array from a workspace document.
     */
    async addNewFeature(
        workspaceId: string,
        releaseId: string,
        features: Partial<Workspace>
    ): Promise<void> {
        const feature = await this.createDocument(
            {
                tag: '',
                description: 'Features are important part of an aplication!',
                emojiId: 'santa',
                action: {
                    type: '',
                    link: '',
                    options: {
                        title: '',
                        autoplay: false,
                        muted: false,
                        startOn: { hour: 0, minute: 0, second: 0 },
                    },
                },
            },
            '',
            `workspaces/${workspaceId}/${collectionPath}`
        );
        features.features?.push({
            tag: '',
            description: 'Features are important part of an aplication!',
            ref: this.af.doc(`workspaces/${workspaceId}/features/${feature.id}`)
                .ref as DocumentReference,
        });
        this.workspaceService.editWorkspaceFeature(workspaceId, features);
        this.releasesService.editReleaseFeature(
            workspaceId,
            releaseId,
            features
        );
    }

    /**
     * Get a feature document.
     * @param featureRef Feature document reference.
     * @returns Return a feature.
     */
    getFeature(featureRef: DocumentReference): Promise<Feature> {
        const featurePath = `workspaces/${
            featureRef.path.split('/')[1]
        }/features`;
        return this.getDocument(featurePath, featureRef.id)
            .pipe(first())
            .toPromise();
    }

    /**
     * Update a feature.
     * @param data New feature data.
     * @param actualTag Actual tag name.
     * @param workspaceId Actual workspace ID.
     * @param featureId Actual feature ID.
     * @param releaseId Actual release ID.
     * @param workspace Features as Partial<Workspace>.
     * @param featureIndex Feature index.
     */
    updateFeature(
        data: Feature,
        actualTag: string,
        workspaceId: string,
        featureId: string,
        releaseId: string,
        workspace: Partial<Workspace>,
        featureIndex: number
    ): void {
        this.updateDocument(
            data,
            `workspaces/${workspaceId}/features`,
            featureId
        );

        if (workspace.features) {
            workspace.features[featureIndex].tag = data.tag;
            workspace.features[featureIndex].description = data.description;
            
            this.workspaceService.editWorkspaceFeature(workspaceId, workspace);
            this.releasesService.editReleaseFeature(
                workspaceId,
                releaseId,
                workspace
            );
        }
    }


    /**
     * Update feature position.
     * @param workspaceId Actual workspace ID.
     * @param releaseId Actual release ID.
     * @param workspace features array in workspace document or release document.
     */
    updateFeaturePosition(
        workspaceId: string,
        releaseId: string,
        workspace: Partial<Workspace>
    ): void {
        this.workspaceService.editWorkspaceFeature(workspaceId, workspace);
        this.releasesService.editReleaseFeature(
            workspaceId,
            releaseId,
            workspace
        );
    }

    /**
     * Get the data from all documents in workspace collection.
     * @param workspaces Feature array from workspace.
     * @param workspaceId Workspace ID.
     * @returns Data from all features documents.
     */
    async getFeaturesDocumentsData(
        workspaces: Partial<Workspace>,
        workspaceId: string
    ): Promise<Feature[]> {
        const snapshot = this.af.firestore
            .collection(`workspaces/${workspaceId}/features`)
            .get();
        const features: Feature[] = [];
        return snapshot.then((data) => {
            workspaces.features?.map((feature, index) => {
                const featureIndex = data.docs.findIndex(
                    (doc) => doc.id == feature.ref.id
                );
                features[index] = {
                    tag: data.docs[featureIndex].data().tag,
                    description: data.docs[featureIndex].data().description,
                    emojiId: data.docs[featureIndex].data().emojiId,
                    action: data.docs[featureIndex].data().action,
                };
            });
            return features;
        });
    }
}
