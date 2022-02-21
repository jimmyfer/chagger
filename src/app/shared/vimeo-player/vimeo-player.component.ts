import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import videojs, { VideoJsPlayer } from 'video.js';
import '@devmobiliza/videojs-vimeo/dist/videojs-vimeo.cjs';

import {
    faPauseCircle,
    faPlayCircle,
    faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { VideoPlayerService } from 'src/app/services/video-player.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { VimeoAuthorize, VimeoVideoList } from 'src/app/models/vimeo';

@Component({
    selector: 'app-vimeo-player',
    templateUrl: './vimeo-player.component.html',
    styleUrls: ['./vimeo-player.component.scss'],
})

/**
 * Vimeo Player.
 */
export class VimeoPlayerComponent implements OnInit {
    @ViewChild('videoPlayer', { static: true }) videoPlayer: ElementRef =
        {} as ElementRef;

    player: videojs.Player = {} as VideoJsPlayer;
    videoTitle = '';

    playVideo = faPlayCircle;
    pauseVideo = faPauseCircle;
    closeVideo = faTimesCircle;

    vimeoAcessToken = '';

    acessTokenUrl =
        'https://cors-anywhere.herokuapp.com/https://api.vimeo.com/oauth/authorize/client';
    apiSearchVideoURL = 'https://cors-anywhere.herokuapp.com/https://api.vimeo.com/videos?query=cats';

    httpHeadersGetToken = {
        headers: new HttpHeaders({
            Authorization: `basic ${btoa(
                '00bec6b266770961fcdf1d89bfcd5551aec4c7a5:36fTR7O0ZRe526k9nZrl5TsjWvsDLhK8nlvhncRx3hafCAZxZrCTox5IjVvsQ+MPTXSssNcDtPi4rqOf4w6WYCcA2Sr0dWffFuUX5jQc1YFskKmHJSOqsdBtpTQkzDos'
            )}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.vimeo.*+json;version=3.4',
        }),
    };
    httpHeaders = {
        headers: new HttpHeaders({
            Authorization: `bearer ${this.vimeoAcessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.vimeo.*+json;version=3.4',
        }),
    };

    httpBody = {
        client_id: 'e0e111549db56f6609e4',
        client_secret: '93e4d34e76f75e6f71a3979718966980781733a2',
    };

    /**
     * Constructor
     */
    constructor(
        private videoPlayerService: VideoPlayerService,
        private http: HttpClient
    ) {}

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.player = videojs(
            this.videoPlayer.nativeElement,
            this.videoPlayerService.options
        );

        this.http
            .post<VimeoAuthorize>(
                this.acessTokenUrl,
                {
                    grant_type: 'client_credentials',
                    scope: 'public private create edit delete upload',
                },
                this.httpHeadersGetToken
            )
            .subscribe((data) => {
                this.vimeoAcessToken = data.access_token;
                console.log(data);
                this.httpHeaders.headers = new HttpHeaders({
                    Authorization: `bearer ${data.access_token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/vnd.vimeo.*+json;version=3.4',
                });
                this.http.get<VimeoVideoList>(this.apiSearchVideoURL, this.httpHeaders).subscribe(data => {
                    console.log(data);
                });
            });
    }
}
