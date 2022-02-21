import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
    faPlay,
    faPlus,
    faEdit,
    faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';
import { ReleasesService } from 'src/app/services/releases.service';
import { Releases } from 'src/app/models/releases.interface';
import { ActivatedRoute } from '@angular/router';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { EmojiID } from 'src/app/models/models';
import { AddActionService } from 'src/app/services/add-action.service';
import { filter, first, map } from 'rxjs/operators';
import {
    WorkspaceFeatures,
    WorkspaceRelease,
} from 'src/app/models/workspace.interface';
import { FeaturesService } from 'src/app/services/features.service';
import { TagsService } from 'src/app/services/tags.service';
import { Tags } from 'src/app/models/tags.interface';
import { MessageService } from 'primeng/api';
import { Feature } from 'src/app/models/feature.interface';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SharedChangelogService } from 'src/app/services/shared-changelog.service';
import { AddFeatureService } from '../../services/add-feature.service';

@Component({
    selector: 'app-features-board',
    templateUrl: './features-board.component.html',
    styleUrls: ['./features-board.component.scss'],
    host: { class: 'flex-grow-1' },
})

/**
 *
 */
export class FeaturesBoardComponent implements OnInit {

    items = [
        {label: 'From GitHub Issue', icon: 'pi pi-github', command: () => {
            this.addFeatureFromGitHub();
        }}
    ];

    active = false;

    _releaseId = this.route.paramMap.pipe(
        map((params) => params.get('releaseId')),
        filter((releaseId): releaseId is string => !!releaseId)
    );

    releaseId = '';

    _workspaceId = this.route.paramMap.pipe(
        map((params) => params.get('workspaceId')),
        filter((releaseId): releaseId is string => !!releaseId)
    );

    workspaceId = '';

    workspaceReleases: WorkspaceRelease[] = [];
    workspaceFeature: WorkspaceFeatures[] = [];

    release: Releases = {} as Releases;

    features: Feature[] = [];

    tags: Tags[] = [];

    releaseUpdatedToast = false;

    workspaceReleaseIndex = 0;

    checkEditFeatureDescription: [{ toggle?: boolean }] = [{}];
    checkEditReleaseDescription = false;

    editReleaseDescriptionWorking = false;
    editFeatureWorking = false;

    // WORKING

    textareaCharacter = '';

    @ViewChild('editReleaseVersionInput', { static: false })
    editReleaseVersionInput: ElementRef<HTMLInputElement> = {} as ElementRef;

    @ViewChild('editFeatureDescriptionTextarea', { static: false })
    editFeatureDescriptionTextarea: ElementRef<HTMLTextAreaElement> = {} as ElementRef;

    @ViewChild('editReleaseDescriptionTextarea', { static: false })
    editReleaseDescriptionTextarea: ElementRef<HTMLTextAreaElement> = {} as ElementRef;

    actionPlay = faPlay;
    addCommit = faPlus;
    editInput = faEdit;
    draggables = faEllipsisV;

    checkEditReleaseVersion = false;
    editReleaseWorking = false;

    // unsubscribeSignal: Subject<void> = new Subject();

    /**
     * Constructor.
     */
    constructor(
        private releaseService: ReleasesService,
        private workspaceService: WorkspaceService,
        private addActionService: AddActionService,
        private addFeatureService: AddFeatureService,
        private featureService: FeaturesService,
        private tagsService: TagsService,
        private messageService: MessageService,
        private sharedChangelog: SharedChangelogService,
        private route: ActivatedRoute
    ) {}

    /**
     * ngOnInit - Watch for parameters change and update the release data on featureBoardComponent.
     */
    ngOnInit(): void {
        setTimeout(() => {
            this.active = true;
        }, 200);

        //Get workspaceId and ReleaseId from params.
        this._releaseId.subscribe(() => {
            Promise.all([
                this._workspaceId.pipe(first()).toPromise(),
                this._releaseId.pipe(first()).toPromise(),
            ]).then((dataId) => {
                [this.workspaceId, this.releaseId] = dataId;
    
                // Set changelog link.
                this.sharedChangelog.link = `${window.location.origin}/public/${this.workspaceId}/changelog/${this.releaseId}`;
    
                // Get release.
                this.releaseService
                    .getRelease(this.workspaceId, this.releaseId)
                    .then((release) => {
                        this.release = release;
                        this.featureService.release = release;
                        this.textareaCharacter = this.release.description;
                        release.features.map(() => {
                            this.checkEditFeatureDescription.push({
                                toggle: false,
                            });
                        });
                        // Get the features array reference on workspace.
                        this.releaseService
                            .getReleaseFeatures(this.releaseId, this.workspaceId)
                            .subscribe((workspaceFeatures) => {
                                this.workspaceFeature = workspaceFeatures;
                                // Gets all the features data.
                                this.featureService
                                    .getFeaturesDocumentsData(
                                        {
                                            features: release.features,
                                        },
                                        this.workspaceId
                                    )
                                    .then((features) => {
                                        this.features = features;
                                        this.tagsService
                                            .getTags(this.workspaceId)
                                            .then((tags) => {
                                                this.tags = tags;
                                                // Get releases array from workspace.
                                                this.workspaceService
                                                    .getWorkspaceReleases(
                                                        this.workspaceId
                                                    )
                                                    .pipe(first())
                                                    .toPromise()
                                                    .then((workspaceReleases) => {
                                                        this.workspaceReleases =
                                                            workspaceReleases;
                                                        this.workspaceReleases.map(
                                                            (
                                                                releaseData,
                                                                index
                                                            ) => {
                                                                if (
                                                                    releaseData.version ==
                                                                    this.release
                                                                        .version
                                                                ) {
                                                                    this.workspaceReleaseIndex =
                                                                        index;
                                                                }
                                                            }
                                                        );
                                                    });
                                            });
                                    });
                            });
                    });
            });
        });
        this.addActionService.currentFeatureActionData.subscribe(
            (actionData) => {
                if (actionData.updateable && actionData.featureIndex != null && actionData.featureIndex >= 0) {
                    this.features[actionData.featureIndex].action =
                        actionData.action;
                    this.featureService.updateFeature(
                        {
                            tag: this.features[actionData.featureIndex].tag,
                            description:
                                this.features[actionData.featureIndex].description,
                            emojiId: this.features[actionData.featureIndex].emojiId,
                            action: this.features[actionData.featureIndex].action,
                        },
                        this.features[actionData.featureIndex].tag,
                        this.workspaceId,
                        this.workspaceFeature[actionData.featureIndex].ref.id,
                        this.releaseId,
                        { features: this.workspaceFeature },
                        actionData.featureIndex
                    );
                }
            }
        );
        this.addActionService.currentReleaseActionData.subscribe(releaseData => {
            if(releaseData.updateable) {
                this.release.action = releaseData.action;
                this.updateRelease();
            }
        });
    }

    /**
     * Release title toggler from text to input and edit the release version.
     * @param e Click, Focus and Enter Key event handler.
     */
    editReleaseVersion(e: Event): void {
        e.preventDefault();
        switch (e.type) {
            case 'click':
                this.checkEditReleaseVersion = true;
                setTimeout(() => {
                    this.editReleaseVersionInput.nativeElement.focus();
                });
                break;
            case 'blur':
                if (!this.editReleaseWorking) {
                    this.checkEditReleaseVersion = false;
                    this.release.version =
                        this.editReleaseVersionInput.nativeElement.value;
                    this.updateRelease();
                }
                this.editReleaseWorking = false;
                break;
            case 'keyup':
                this.checkEditReleaseVersion = false;
                this.editReleaseWorking = true;
                this.release.version =
                    this.editReleaseVersionInput.nativeElement.value;
                this.updateRelease();
                break;
        }
    }

    /**
     * Release title toggler from text to input and edit the release version.
     * @param e Click, Focus and Enter Key event handler.
     */
    editReleaseDescription(e: Event): void {
        e.preventDefault();
        switch (e.type) {
            case 'click':
                this.checkEditReleaseDescription = true;
                setTimeout(() => {
                    this.editReleaseDescriptionTextarea.nativeElement.focus();
                });
                break;
            case 'blur':
                if (!this.editReleaseDescriptionWorking) {
                    this.checkEditReleaseDescription = false;
                    this.release.description =
                        this.editReleaseDescriptionTextarea.nativeElement.value;
                    this.updateRelease();
                }
                this.editReleaseDescriptionWorking = false;
                break;
            case 'keyup':
                this.checkEditReleaseDescription = false;
                this.editReleaseDescriptionWorking = true;
                this.release.description =
                    this.editReleaseDescriptionTextarea.nativeElement.value;
                this.updateRelease();
                break;
        }
    }

    /**
     * Update the release.
     */
    updateRelease(): void {
        this.releaseService.updateRelease(
            {
                version: this.release.version,
                description: this.textareaCharacter,
                action: this.release.action
                    ? this.release.action
                    : {
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
                emojiId: this.release.emojiId,
                features: this.release.features,
            },
            this.workspaceReleaseIndex,
            this.workspaceId as string,
            this.releaseId as string,
            {
                releases: this.workspaceReleases,
            }
        );
        this.releaseUpdateToast();
    }

    /**
     * Trigger the update toast for 0.5 seconds.
     */
    releaseUpdateToast(): void {
        this.releaseUpdatedToast = true;
        setTimeout(() => {
            this.releaseUpdatedToast = false;
        }, 500);
    }

    /**
     *
     * @param data Data of the emoji selected.
     */
    addEmoji(data: EmojiID): void {
        this.release.emojiId = data.emoji.id;
        this.updateRelease();
    }

    /**
     * Add new feature to Database.
     */
    addFeature(): void {
        this.featureService.addNewFeature(this.workspaceId, this.releaseId, {
            features: this.release.features,
        });
    }

    /**
     * Add new feature from GitHub issue.
     */
    addFeatureFromGitHub(): void {
        this.addFeatureService.isAddFeatureVisible = true;
    }

    /**
     * Change the tag of a feature.
     * @param e Click Event.
     * @param featureIndex Feature index.
     * @param tagIndex Tag index.
     */
    updateTag(e: Event, featureIndex: number, tagIndex: number): void {
        e.preventDefault();
        if (this.workspaceId) {
            this.featureService.updateFeature(
                {
                    tag: this.tags[tagIndex].name,
                    description: this.features[featureIndex].description,
                    emojiId: this.features[featureIndex].emojiId,
                    action: this.features[featureIndex].action,
                },
                this.features[featureIndex].tag,
                this.workspaceId,
                this.workspaceFeature[featureIndex].ref.id,
                this.releaseId,
                { features: this.workspaceFeature },
                featureIndex
            );
        }
    }

    /**
     * Send a warning toast if there is not any tags.
     * @param e Click Event.
     */
    checkTags(e: Event): void {
        e.preventDefault();
        this.messageService.clear();
        if (!this.tags.length) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Tags not found!',
                detail: 'You need to add some tag to your workspace.',
            });
        }
    }

    /**
     * Edit the selected feature description.
     * @param e Click event.
     * @param featureIndex Feature index.
     */
    editFeatureDescription(e: Event, featureIndex: number): void {
        e.preventDefault();
        switch (e.type) {
            case 'click':
                this.checkEditFeatureDescription[featureIndex].toggle = true;
                setTimeout(() => {
                    this.editFeatureDescriptionTextarea.nativeElement.focus();
                });
                break;
            case 'blur':
                if (!this.editFeatureWorking) {
                    this.checkEditFeatureDescription[featureIndex].toggle =
                        false;
                    if (this.workspaceId) {
                        this.featureService.updateFeature(
                            {
                                tag: this.features[featureIndex].tag,
                                description:
                                    this.editFeatureDescriptionTextarea
                                        .nativeElement.value,
                                emojiId: this.features[featureIndex].emojiId,
                                action: this.features[featureIndex].action,
                            },
                            this.features[featureIndex].tag,
                            this.workspaceId,
                            this.workspaceFeature[featureIndex].ref.id,
                            this.releaseId,
                            { features: this.workspaceFeature },
                            featureIndex
                        );
                    } else {
                        console.warn('There is not any workspace ID.');
                    }
                }
                this.editFeatureWorking = false;
                break;
            case 'keyup':
                this.checkEditFeatureDescription[featureIndex].toggle = false;
                this.editFeatureWorking = true;
                if (this.workspaceId) {
                    this.featureService.updateFeature(
                        {
                            tag: this.features[featureIndex].tag,
                            description:
                                this.editFeatureDescriptionTextarea
                                    .nativeElement.value,
                            emojiId: this.features[featureIndex].emojiId,
                            action: this.features[featureIndex].action,
                        },
                        this.features[featureIndex].tag,
                        this.workspaceId,
                        this.workspaceFeature[featureIndex].ref.id,
                        this.releaseId,
                        { features: this.workspaceFeature },
                        featureIndex
                    );
                } else {
                    console.warn('There is not any workspace ID.');
                }
                break;
        }
    }

    /**
     * Update features position.
     * @param event Draggable event.
     */
    updateFeaturePosition(event: CdkDragDrop<string[]>) {
        moveItemInArray(
            this.workspaceFeature,
            event.previousIndex,
            event.currentIndex
        );
        this.featureService.updateFeaturePosition(
            this.workspaceId,
            this.releaseId,
            { features: this.workspaceFeature }
        );
    }

    /**
     *
     * @param data Data of the emoji selected.
     * @param featureIndex Feature index.
     */
    addFeatureEmoji(data: EmojiID, featureIndex: number): void {
        if (this.workspaceId) {
            this.featureService.updateFeature(
                {
                    tag: this.features[featureIndex].tag,
                    description: this.features[featureIndex].description,
                    emojiId: data.emoji.id,
                    action: this.features[featureIndex].action,
                },
                this.features[featureIndex].tag,
                this.workspaceId,
                this.workspaceFeature[featureIndex].ref.id,
                this.releaseId,
                { features: this.workspaceFeature },
                featureIndex
            );
        }
    }

    /**
     * When component get destroyed the release will stop watching for parameters change.
     */
    ngOnDestroy(): void {}
}
