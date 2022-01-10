import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReleasesService } from 'src/app/services/releases.service';
import { DocumentReference } from '@angular/fire/compat/firestore';

import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { WorkspaceFeatures, WorkspaceRelease } from 'src/app/models/workspace.interface';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-releases-board',
    templateUrl: './releases-board.component.html',
    styleUrls: ['./releases-board.component.scss'],
    host: { class: 'flex-grow-1' },
})

/**
 *
 */
export class ReleasesBoardComponent {
    
    releases$: Observable<WorkspaceRelease[]> = this.route.paramMap.pipe(
        map((params) => params.get('workspaceId')),
        filter((workspaceId): workspaceId is string => !!workspaceId),
        switchMap((workspaceId) =>
            this.workspaceService.getWorkspaceReleases(workspaceId)
        )
    );

    @ViewChild('addReleaseInput', { static: false })
    addReleaseInput: ElementRef<HTMLInputElement> = {} as ElementRef;

    @ViewChild('editReleaseVersionInput', { static: false })
    editReleaseVersionInput: ElementRef<HTMLInputElement> = {} as ElementRef;

    editRelease: boolean[] = [];
    editReleaseWorking = false;

    addRelease = false;
    addReleaseWorking = false;

    /**
     * Get the actual workspace.
     */
    get activeWorkspace(): DocumentReference {
        const workspaceId = this.route.snapshot.paramMap.get('workspaceId');
        if (workspaceId) {
            return this.workspaceService.getReference(workspaceId);
        }
        throw 'Workspace ID not exist!';
    }

    /**
     * Get the actual workspaceId
     */
    get workspaceId(): string {
        const workspaceId = this.route.snapshot.paramMap.get('workspaceId');
        if (workspaceId) {
            return workspaceId;
        }
        throw 'Cant get the actual workspace ID';
    }

    /**
     *
     * @param releaseService Service to handle user releases collection in database.
     * @param workspaceService Service to handle user workspaces collection in database.
     * @param confirmationService Service to handle confirmations messages.
     */
    constructor(
        private releaseService: ReleasesService,
        private workspaceService: WorkspaceService,
        private confirmationService: ConfirmationService,
        private route: ActivatedRoute
    ) {}

    /**
     * New release interface toggler from link to input and vice versa.
     * @param e Click, Focus and Enter Key event handler.
     */
    newRelease(e: Event): void {
        e.preventDefault();
        switch (e.type) {
            case 'click':
                this.addRelease = true;
                setTimeout(() => {
                    this.addReleaseInput.nativeElement.focus();
                });
                break;
            case 'blur':
                if (!this.addReleaseWorking) {
                    this.addRelease = false;
                    this.addNewRelease(
                        this.addReleaseInput.nativeElement.value
                    );
                }
                this.addReleaseWorking = false;
                break;
            case 'keyup':
                this.addRelease = false;
                this.addReleaseWorking = true;
                this.addNewRelease(this.addReleaseInput.nativeElement.value);
                break;
        }
    }

    /**
     * Add new release to Database.
     * @param releaseVersion relase version.
     */
    addNewRelease(releaseVersion: string): void {
        const workspace = this.activeWorkspace;
        if (!workspace) {
            return;
        }
        this.workspaceService
            .getWorkspaceReleasesOnce(this.workspaceId)
            .then((releases) => {
                this.releaseService.addNewRelease(
                    {
                        version: releaseVersion,
                        description: '',
                        action: {
                            type: '',
                            link: '',
                            options: {
                                title: '',
                                autoplay: false,
                                muted: false,
                                startOn: {
                                    hour: 0,
                                    minute: 0,
                                    second: 0,
                                },
                            },
                        },
                        emojiId: 'rocket',
                        features: []
                    },
                    workspace.id,
                    { releases: releases }
                );
            });
    }

    /**
     * Release title toggler from text to input and edit the release version.
     * @param e Click, Focus and Enter Key event handler.
     * @param releaseIndex Release index.
     */
    editReleaseVersion(e: Event, releaseIndex: number): void {
        e.preventDefault();
        this.workspaceService
            .getWorkspaceReleasesOnce(this.workspaceId)
            .then((releases) => {
                switch (e.type) {
                    case 'click':
                        this.editRelease[releaseIndex] = true;
                        setTimeout(() => {
                            this.editReleaseVersionInput.nativeElement.focus();
                        });
                        break;
                    case 'blur':
                        if (!this.editReleaseWorking) {
                            this.editRelease[releaseIndex] = false;
                            this.updateReleaseVersion(
                                this.editReleaseVersionInput.nativeElement
                                    .value,
                                releases[releaseIndex].ref,
                                releases[releaseIndex].version,
                                releases[releaseIndex].emojiId,
                                releases[releaseIndex].features
                            );
                        }
                        this.editReleaseWorking = false;
                        break;
                    case 'keyup':
                        this.editRelease[releaseIndex] = false;
                        this.editReleaseWorking = true;
                        this.updateReleaseVersion(
                            this.editReleaseVersionInput.nativeElement.value,
                            releases[releaseIndex].ref,
                            releases[releaseIndex].version,
                            releases[releaseIndex].emojiId,
                            releases[releaseIndex].features
                        );
                        break;
                }
            });
    }

    /**
     * Detele the selected release.
     * @param e Click event handler.
     * @param releaseIndex release index.
     */
    deleteRelease(e: Event, releaseIndex: number) {
        e.preventDefault();
        const workspace = this.activeWorkspace;
        if (!workspace) {
            return;
        }
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this release?',
            accept: () => {
                this.workspaceService
                    .getWorkspaceReleasesOnce(this.workspaceId)
                    .then((releases) => {
                        this.releaseService.deleteRelease(
                            releases[releaseIndex].ref.path,
                            workspace.id,
                            { releases: releases },
                            releases[releaseIndex].version
                        );
                    });
            },
        });
    }

    /**
     * Update the selected release.
     * @param newVersion New release version.
     * @param releaseId Release document reference in the database.
     * @param actualVersion Actual release version.
     * @param actualEmoji Actual release emoji.
     * @param features Actual features.
     */
    updateReleaseVersion(
        newVersion: string,
        releaseId: DocumentReference,
        actualVersion: string,
        actualEmoji: string,
        features: WorkspaceFeatures[]
    ): void {
        const workspace = this.activeWorkspace;
        if (!workspace) {
            return;
        }
        this.workspaceService
            .getWorkspaceReleasesOnce(this.workspaceId)
            .then((releases) => {
                this.releaseService.updateRelease(
                    {
                        version: newVersion,
                        description:
                            'I know i am a good release, dont you think?',
                        emojiId: actualEmoji,
                        features: features
                    },
                    actualVersion,
                    workspace.id,
                    releaseId.id,
                    { releases: releases }
                );
            });
    }
}
