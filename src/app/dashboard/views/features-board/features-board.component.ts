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
import { Action } from 'src/app/models/action';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, Subject, Subscription } from 'rxjs';
import { WorkspaceFeatures } from 'src/app/models/workspace.interface';
import { FeaturesService } from 'src/app/services/features.service';
import { TagsService } from 'src/app/services/tags.service';
import { Tags } from 'src/app/models/tags.interface';
import { MessageService } from 'primeng/api';
import { Feature } from 'src/app/models/feature.interface';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SharedChangelogService } from 'src/app/services/shared-changelog.service';

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

    tags: Tags[] = [];

    features$: Observable<WorkspaceFeatures[]> = this.route.paramMap.pipe(
        map((params) => params.get('releaseId')),
        filter((releaseId): releaseId is string => !!releaseId),
        switchMap((releaseId) => {
            if (this.workspaceId) {
                return this.releaseService.getReleaseFeatures(
                    releaseId,
                    this.workspaceId
                );
            } else {
                throw 'Not getting the WorkspaceID';
            }
        })
    );

    features: WorkspaceFeatures[] = [];

    featuresData: Feature[] = [];

    textareaCharacter = '';

    @ViewChild('editReleaseVersionInput', { static: false })
    editReleaseVersionInput: ElementRef<HTMLInputElement> = {} as ElementRef;

    @ViewChild('editFeatureDescriptionTextarea', { static: false })
    editFeatureDescriptionTextarea: ElementRef<HTMLTextAreaElement> = {} as ElementRef;

    actionPlay = faPlay;
    addCommit = faPlus;
    editInput = faEdit;
    draggables = faEllipsisV;

    checkEditReleaseVersion = false;
    editReleaseWorking = false;

    release: Releases = {
        version: '',
        description: '',
        emojiId: '',
        features: [],
    };
    oldReleaseVersion = '';

    workspaceId = this.route.parent?.parent?.snapshot.paramMap.get('workspaceId');
    releaseId = '';

    releaseWatcher: Subscription | null = null;

    releaseUpdatedToast = false;

    releaseActionData: Action | null = null;

    featureEmojiId: string[] = [];
    featureActionData: Action[] = [];

    checkEditFeatureDescription: [{ toggle?: boolean }] = [{}];
    editFeatureWorking = false;

    unsubscribeSignal: Subject<void> = new Subject();

    /**
     * Constructor.
     */
    constructor(
        private releaseService: ReleasesService,
        private workspaceService: WorkspaceService,
        private addActionService: AddActionService,
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


        this.releaseWatcher = this.route.paramMap
            .pipe(
                map((params) => params.get('releaseId')),
                filter((releaseId): releaseId is string => !!releaseId)
            )
            .subscribe((releaseId) => {
                this.releaseId = releaseId;
                this.sharedChangelog.link = `http://localhost:4200/public/${this.workspaceId}/changelog/${this.releaseId}`;
                if (this.workspaceId) {
                    this.releaseService
                        .getRelease(this.workspaceId, this.releaseId)
                        .then((release) => {
                            this.release = release;
                            release.action
                                ? this.addActionService.updateReleaseActionData(
                                    release.action,
                                    false
                                )
                                : this.addActionService.updateReleaseActionData(
                                      {} as Action,
                                      false
                                );
                            this.textareaCharacter = release.description;
                        });
                }
            });
        this.features$.subscribe((features) => {
            this.features = features;
            if (this.workspaceId) {
                this.featureService
                    .getFeaturesDocumentsData(
                        { features: features },
                        this.workspaceId
                    )
                    .then((features) => {
                        this.featuresData = features;
                    });
            }

            features.forEach((feature, index) => {
                this.featureService.getFeature(feature.ref).then((feature) => {
                    this.checkEditFeatureDescription.push({ toggle: false });
                    this.addActionService.updateFeatureActionData(
                        feature.action,
                        false
                    );
                });
            });
        });
        if (this.workspaceId) {
            this.tagsService.getTags(this.workspaceId).then((tags) => {
                this.tags = tags;
            });
        }

        this.addActionService.currentReleaseActionData
            .pipe(takeUntil(this.unsubscribeSignal.asObservable()))
            .subscribe((actionObserver) => {
                this.releaseActionData = actionObserver.action;
                if (actionObserver.updateable) {
                    this.updateRelease();
                }
            });

        this.addActionService.currentFeatureActionData
            .pipe(takeUntil(this.unsubscribeSignal.asObservable()))
            .subscribe((actionObserver) => {
                this.featureActionData = actionObserver.actions;
                if (
                    actionObserver.updateable &&
                    actionObserver.featureIndex != null &&
                    actionObserver.featureIndex >= 0 &&
                    this.workspaceId
                ) {
                    console.log(this.features[actionObserver.featureIndex].tag);
                    console.log('hello, featurebpoard');
                    this.featureService.updateFeature(
                        {
                            tag: this.features[actionObserver.featureIndex].tag,
                            description:
                                this.features[actionObserver.featureIndex]
                                    .description,
                            emojiId: this.featuresData[actionObserver.featureIndex].emojiId,
                            action: this.featureActionData[
                                actionObserver.featureIndex
                            ],
                        },
                        this.features[actionObserver.featureIndex].tag,
                        this.workspaceId,
                        this.features[actionObserver.featureIndex].ref.id,
                        this.releaseId,
                        { features: this.features },
                        actionObserver.featureIndex
                    );
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
                    this.oldReleaseVersion = this.release.version;
                    this.release.version =
                        this.editReleaseVersionInput.nativeElement.value;
                }
                this.editReleaseWorking = false;
                break;
            case 'keyup':
                this.checkEditReleaseVersion = false;
                this.editReleaseWorking = true;
                this.oldReleaseVersion = this.release.version;
                this.release.version =
                    this.editReleaseVersionInput.nativeElement.value;
                break;
        }
    }

    /**
     * Update the release.
     */
    updateRelease(): void {
        if (this.workspaceId && this.releaseId) {
            this.workspaceService
                .getWorkspaceReleasesOnce(this.workspaceId)
                .then((releases) => {
                    this.releaseService.updateRelease(
                        {
                            version: this.release.version,
                            description: this.textareaCharacter,
                            action: this.releaseActionData
                                ? this.releaseActionData
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
                        this.oldReleaseVersion,
                        this.workspaceId as string,
                        this.releaseId as string,
                        {
                            releases: releases,
                        }
                    );
                });
            this.releaseUpdatedToast = true;
            setTimeout(() => {
                this.releaseUpdatedToast = false;
            }, 1000);
        } else {
            throw 'Workspace ID or Release ID dont exist!';
        }
    }

    /**
     *
     * @param data Data of the emoji selected.
     */
    addEmoji(data: EmojiID): void {
        this.release.emojiId = data.emoji.id;
    }

    /**
     * Add new feature to Database.
     */
    addFeature(): void {
        const workspaceId = this.workspaceId;
        if (!workspaceId) {
            return;
        }
        this.featureService.addNewFeature(workspaceId, this.releaseId, {
            features: this.features,
        });
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
                    emojiId: this.featuresData[featureIndex].emojiId,
                    action: this.featureActionData[featureIndex],
                },
                this.features[featureIndex].tag,
                this.workspaceId,
                this.features[featureIndex].ref.id,
                this.releaseId,
                { features: this.features },
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
                                emojiId: this.featuresData[featureIndex].emojiId,
                                action: this.featureActionData[featureIndex],
                            },
                            this.features[featureIndex].tag,
                            this.workspaceId,
                            this.features[featureIndex].ref.id,
                            this.releaseId,
                            { features: this.features },
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
                            emojiId: this.featuresData[featureIndex].emojiId,
                            action: this.featureActionData[featureIndex],
                        },
                        this.features[featureIndex].tag,
                        this.workspaceId,
                        this.features[featureIndex].ref.id,
                        this.releaseId,
                        { features: this.features },
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
        if (this.workspaceId) {
            moveItemInArray(
                this.features,
                event.previousIndex,
                event.currentIndex
            );
            this.featureService.updateFeaturePosition(
                this.workspaceId,
                this.releaseId,
                { features: this.features }
            );
        } else {
            console.warn('There is not any workspace ID.');
        }
    }

    /**
     *
     * @param data Data of the emoji selected.
     * @param featureIndex Feature index.
     */
    addFeatureEmoji(data: EmojiID, featureIndex: number): void {
        if(this.workspaceId) {
            this.featureService.updateFeature(
                {
                    tag: this.features[featureIndex].tag,
                    description:
                        this.features[featureIndex]
                            .description,
                    emojiId: data.emoji.id,
                    action: this.featureActionData[
                        featureIndex
                    ],
                },
                this.features[featureIndex].tag,
                this.workspaceId,
                this.features[featureIndex].ref.id,
                this.releaseId,
                { features: this.features },
                featureIndex
            );
        }
    }

    /**
     * When component get destroyed the release will stop watching for parameters change.
     */
    ngOnDestroy(): void {
        this.releaseWatcher?.unsubscribe();
        this.unsubscribeSignal.unsubscribe();
    }
}
