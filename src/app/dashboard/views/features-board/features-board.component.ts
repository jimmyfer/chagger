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

    release: Releases = { version: '', description: '', action: {}, emojiId: '' }
    oldReleaseVersion = '';

    workspaceId = this.route.parent?.parent?.snapshot.paramMap.get('workspaceId');
    releaseId = this.route.snapshot.paramMap.get('releaseId');

    /**
     * Constructor.
     */
    constructor(
        private releaseService: ReleasesService,
        private workspaceService: WorkspaceService,
        private route: ActivatedRoute

    ) {}

    /**
     * ngOnInit.
     */
    ngOnInit(): void {
        if(this.workspaceId && this.releaseId) {
            this.releaseService.getRelease(this.workspaceId, this.releaseId).then((release) => {
                this.release = release;
            });
        }
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
                        description: this.release.description,
                        action: this.release.action,
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
        }else {
            throw 'Workspace ID or Release ID dont exist!';
        }
    }

    /**
     * Call add-action component.
     * @param e Click event.
     */
    addAction( e: Event ): void {
        e.preventDefault();
    }

    /**
     * 
     * @param data Data of the emoji selected.
     */
    addEmoji(data: EmojiID): void {
        this.release.emojiId = data.emoji.id;
    }
}