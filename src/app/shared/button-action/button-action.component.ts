import { Component, Input, OnInit, Output } from '@angular/core';
import { faPlay, faPlus, faLink } from '@fortawesome/free-solid-svg-icons';
import { Action } from 'src/app/models/action';
import { AddActionService } from 'src/app/services/add-action.service';
import { VideoPlayerService } from 'src/app/services/video-player.service';

@Component({
    selector: 'app-button-action',
    templateUrl: './button-action.component.html',
    styleUrls: ['./button-action.component.scss'],
})

/**
 * Button that show an action if exist or option to add an action if not.
 */
export class ButtonActionComponent implements OnInit {
    
    @Input() actionData: Action | null = null;
    @Input() featureIndex: number | null = null;

    @Input() develop = false;

    @Input() bigButton = false;
    @Input() smallButton = false;

    /**
     * Get the action if exist.
     */
    get action(): Action {
        if(this.actionData) {
            return this.actionData;
        }
        return {type: '', link: '', options: { title: '', autoplay: false, muted: false, startOn: { hour: 0, minute: 0, second: 0 } }};
    }

    actionPlay = faPlay;
    addNewAction = faPlus;
    actionLink = faLink;

    /**
     * Consturctor.
     */
    constructor(
        private addActionService: AddActionService,
        private videoPlayerService: VideoPlayerService
    ) {}

    /**
     * ngOnInit.
     */
    ngOnInit(): void {}

    /**
     * Call add-action component.
     * @param e Click event.
     */
    callAddAction(e: Event): void {
        e.preventDefault();
        this.addActionService.callAddAction( this.featureIndex );
    }

    /**
     * Start the chagger video player with the actual action data.
     * @param e Click event.
     */
    playVideoAction(e: Event): void {
        e.preventDefault();
        const hour = this.actionData?.options.startOn.hour;
        const minute = this.actionData?.options.startOn.minute;
        const second = this.actionData?.options.startOn.second;
        this.videoPlayerService.setTime = (hour ? hour : 0 * 60) + (minute ? minute : 0 * 60) + (second ? second : 0 * 60);
        this.videoPlayerService.videoTitle = this.actionData?.options.title ? this.actionData?.options.title : '';
        this.videoPlayerService.options = {
            techOrder: ['youtube'],
            muted: this.actionData?.options.muted,
            autoplay: this.actionData?.options.autoplay,
            sources: [
                {
                    src: this.actionData?.link,
                    type: 'video/youtube',
                },
            ],
        };
        this.videoPlayerService.isVideoPlayerVisible = true;
    }

    /**
     * Open link.
     * @param e Click event.
     */
    openLink(e: Event): void {
        e.preventDefault();
        if(this.actionData) {
            window.open(this.actionData.link, '_blank')?.focus();
        }
    }
}
