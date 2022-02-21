import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VideoPlayerService } from 'src/app/services/video-player.service';
import videojs, { VideoJsPlayer } from 'video.js';
import 'videojs-youtube';
import { faPauseCircle, faPlayCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-video-player',
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.scss'],
})

/**
 * Chagger Video Player 1.0.0
 */
export class VideoPlayerComponent implements OnInit {
    @ViewChild('videoPlayer', { static: true }) videoPlayer: ElementRef =
        {} as ElementRef;

    player: videojs.Player = {} as VideoJsPlayer;
    videoTitle = '';

    playVideo = faPlayCircle;
    pauseVideo = faPauseCircle;
    closeVideo = faTimesCircle;

    /**
     * Constructor.
     */
    constructor(
        private videoPlayerService: VideoPlayerService
    ) {}

    /**
     * ngOnInit.
     */
    ngOnInit(): void {
        this.videoTitle = this.videoPlayerService.videoTitle;
        this.player = videojs(
            this.videoPlayer.nativeElement
        );
        this.player.currentTime(this.videoPlayerService.setTime);
    }

    /**
     * Play the video.
     * @param e Click Event.
     */
    playVideoPlayer(e: Event): void {
        e.preventDefault();
        this.player.play();
    }

    /**
     * 
     * @param e Click Event.
     */
    pauseVideoPlayer(e: Event): void {
        e.preventDefault();
        this.player.pause();
    }

    /**
     * 
     * @param e Click Event.
     */
    closeVideoPlayer(e: Event): void {
        e.preventDefault();
        this.videoPlayerService.isVideoPlayerVisible = false;
    }

    /**
     * ngOnDestroy.
     */
    ngOnDestroy() {
        // destroy player
        if (this.player) {
            this.player.dispose();
        }
    }
}
