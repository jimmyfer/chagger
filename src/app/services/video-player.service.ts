import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})


/**
 * Chagger Video Player Service
 */
export class VideoPlayerService {

    options = {};

    isVideoPlayerVisible = false;
    videoLink = '';
    videoTitle = '';

    setTime = 0;


    /**
     * Constructor.
     */
    constructor() {
    }
}
