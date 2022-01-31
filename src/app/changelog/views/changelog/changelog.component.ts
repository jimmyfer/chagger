import { Component, OnInit } from '@angular/core';
import { GalleryService } from 'src/app/services/gallery.service';
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
     * Get the addActionService state - Visible or Not.
     */
    get isGalleryVisible(): boolean {
        return this.galleryService.isGalleryVisible;
    }

    /**
     * Constructor.
     */
    constructor(private videoPlayerService: VideoPlayerService, private galleryService: GalleryService) {}


    /**
     * ngOnInit.
     */
    ngOnInit(): void {}
}
