import { Component, OnInit } from '@angular/core';
import { VideoPlayerService } from 'src/app/services/video-player.service';

@Component({
    selector: 'app-changelog',
    templateUrl: './changelog.component.html',
    styleUrls: ['./changelog.component.scss'],
})

/**
 * Changelog component.
 */
export class ChangelogComponent implements OnInit {

    /**
     * Get the addActionService state - Visible or Not.
     */
    get isVideoPlayerVisible(): boolean {
        return this.videoPlayerService.isVideoPlayerVisible;
    }

    /**
     * Constructor.
     */
    constructor(private videoPlayerService: VideoPlayerService) {}


    /**
     * ngOnInit.
     */
    ngOnInit(): void {}
}
