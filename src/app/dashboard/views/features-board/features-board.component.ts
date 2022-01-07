import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
    faPlay,
    faPlus,
    faEdit,
} from '@fortawesome/free-solid-svg-icons';
import { ReleasesService } from 'src/app/services/releases.service';
import { Releases } from 'src/app/models/releases.interface';
import { ActivatedRoute } from '@angular/router';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { EmojiID } from 'src/app/models/models';
import { AddActionService } from 'src/app/services/add-action.service';
import { Action } from 'src/app/models/action';
import { filter, map, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-features-board',
    templateUrl: './features-board.component.html',
    styleUrls: ['./features-board.component.scss'],
    host: {'class': 'flex-grow-1'}
})

/**
 *
 */
export class FeaturesBoardComponent implements OnInit {

    textareaCharacter = '';

    @ViewChild('editReleaseVersionInput', { static: false })
    editReleaseVersionInput: ElementRef<HTMLInputElement> = {} as ElementRef;

    actionPlay = faPlay;
    addCommit = faPlus;
    editReleaseVersionTitle = faEdit;

    checkEditReleaseVersion = false;
    editReleaseWorking = false;

    release: Releases = { version: '', description: '', emojiId: '' }
    oldReleaseVersion = '';

    workspaceId = this.route.parent?.parent?.snapshot.paramMap.get('workspaceId');
    releaseId = '';

    releaseWatcher: Subscription | null = null;

    releaseUpdatedToast = false;

    /**
     * Return the Action Object from AddActionService.
     */
    get addActionData(): Action | null | undefined {
        return this.addActionService.addActionData;
    }
    

    /**
     * Constructor.
     */
    constructor(
        private releaseService: ReleasesService,
        private workspaceService: WorkspaceService,
        private addActionService: AddActionService,
        private route: ActivatedRoute

    ) {}

    /**
     * ngOnInit - Watch for parameters change and update the release data on featureBoardComponent.
     */
    ngOnInit(): void {
        this.releaseWatcher = this.route.paramMap.pipe(
            map(params => params.get('releaseId')),
            filter((releaseId): releaseId is string => !!releaseId )
        ).subscribe((releaseId) => {
            this.releaseId = releaseId;
            if(this.workspaceId) {
                this.releaseService.getRelease(this.workspaceId, this.releaseId).then((release) => {
                    this.release = release;
                    this.textareaCharacter = release.description;
                    this.addActionService.addActionData = release.action;
                });
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
        if(this.workspaceId && this.releaseId) {
            this.workspaceService.getWorkspaceReleasesOnce(this.workspaceId).then(releases => {
                this.releaseService.updateRelease(
                    {
                        version: this.release.version,
                        description: this.textareaCharacter,
                        action: this.addActionData ? this.addActionData : { type: '', link: '', options: {title: '', autoplay: false, muted: false, startOn: {hour: 0, minute: 0, second: 0}} },
                        emojiId: this.release.emojiId
                    },
                    this.oldReleaseVersion,
                    this.workspaceId as string,
                    this.releaseId as string,
                    {
                        releases: releases
                    }
                );
            });
            this.releaseUpdatedToast = true;
            setTimeout(() => {
                this.releaseUpdatedToast = false;
            }, 1000);
        }else {
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
     * When component get destroyed the release will stop watching for parameters change.
     */
    ngOnDestroy(): void {
        this.releaseWatcher?.unsubscribe();
        this.addActionService.addActionData = null;
    }
}