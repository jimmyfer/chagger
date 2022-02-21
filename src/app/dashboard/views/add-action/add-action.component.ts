import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FileUpload } from 'primeng/fileupload';
import { fromEvent, Subscription } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    first,
    map,
} from 'rxjs/operators';
import { VimeoVideoList } from 'src/app/models/vimeo';
import { AddActionService } from 'src/app/services/add-action.service';
import { UserService } from 'src/app/services/user.service';
import { VimeoService } from 'src/app/services/vimeo.service';

@Component({
    selector: 'app-add-action',
    templateUrl: './add-action.component.html',
    styleUrls: ['./add-action.component.scss'],
})

/**
 * Add action modal.
 */
export class AddActionComponent implements OnInit {
    _workspaceId = this.route.firstChild?.paramMap.pipe(
        map((params) => params.get('workspaceId')),
        filter((releaseId): releaseId is string => !!releaseId)
    );

    workspaceId = '';

    @ViewChild('searchVideo', { static: false }) searchVideo: ElementRef =
        {} as ElementRef;
    @ViewChild('actionType', { static: false }) actionType: ElementRef =
        {} as ElementRef;
    @ViewChild('fileuploader', { static: false }) fileuploader: FileUpload =
        {} as FileUpload;
    @ViewChild('fileInput', { static: false })
    fileInput: ElementRef<HTMLInputElement> = {} as ElementRef;

    actionTypeCheck = 'video';
    videoProvierCheck = 'vimeo';

    searchingActive = false;
    videoListExist = false;

    featureIndex = this.addActionService.featureIndex;

    seconds: number[] = [];
    minutes: number[] = [];
    hours: number[] = [];

    selectedFiles: File[] = [];

    uploadForm: SafeHtml = '';

    /**
     * Return the uploaded percent.
     */
    get uploadPercent(): number {
        return Math.round(this.addActionService.uploadPercent);
    }

    /**
     * Return the uploaded percent.
     */
    get uploadFilesPercent(): number {
        return Math.round(this.addActionService.uploadFilesPercent);
    }

    videoList: VimeoVideoList = {} as VimeoVideoList;

    uploadPercentWatcher: Subscription | null = null;
    searchVideoWatcher: Subscription | null = null;

    vimeoLogin = false;

    second = 0;
    minute = 0;
    hour = 0;
    title = '';
    autoPlay = false;
    muted = false;
    link!: string;

    /**
     * Constructor.
     */
    constructor(
        private addActionService: AddActionService,
        private userService: UserService,
        private vimeoService: VimeoService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer
    ) {}

    /**
     * Angular OnInit.
     */
    ngOnInit(): void {
        this.vimeoService.checkIfUserIsLogIn().then((resp) => {
            if (resp) {
                console.log(resp);
                this.vimeoLogin = true;
            }
        });
        this.seconds = Array(60)
            .fill(1)
            .map((x, i) => i);
        this.minutes = Array(60)
            .fill(1)
            .map((x, i) => i);
        this.hours = Array(11)
            .fill(1)
            .map((x, i) => i);
        if (this._workspaceId) {
            this._workspaceId
                .pipe(first())
                .toPromise()
                .then((workspaceId) => {
                    this.workspaceId = workspaceId;
                });
        }
    }

    /**
     *
     * @param e Click event
     */
    returnAction(e: Event): void {
        e.preventDefault();
        switch (this.actionTypeCheck) {
            case 'video':
                if (this.featureIndex != null && this.featureIndex >= 0) {
                    this.addActionService.updateFeatureActionData(
                        {
                            type: this.actionType.nativeElement.value,
                            link: this.link,
                            options: {
                                title: this.title,
                                startOn: {
                                    hour: this.hour,
                                    minute: this.minute,
                                    second: this.second,
                                },
                                autoplay: this.autoPlay,
                                muted: this.muted,
                            },
                        },
                        true,
                        this.featureIndex
                    );
                } else {
                    this.addActionService.updateReleaseActionData(
                        {
                            type: this.actionType.nativeElement.value,
                            link: this.link,
                            options: {
                                title: this.title,
                                startOn: {
                                    hour: this.hour,
                                    minute: this.minute,
                                    second: this.second,
                                },
                                autoplay: this.autoPlay,
                                muted: this.muted,
                            },
                        },
                        true
                    );
                }
                break;

            case 'link':
                if (this.featureIndex != null && this.featureIndex >= 0) {
                    this.addActionService.updateFeatureActionData(
                        {
                            type: 'link',
                            link: this.link,
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
                        true,
                        this.featureIndex
                    );
                } else {
                    this.addActionService.updateReleaseActionData(
                        {
                            type: 'link',
                            link: this.link,
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
                        true
                    );
                }

                break;

            case 'file':
                if (this.featureIndex != null && this.featureIndex >= 0) {
                    if (this.fileInput.nativeElement.files) {
                        this.addActionService
                            .uploadActionFile(
                                this.fileInput.nativeElement.files,
                                this.workspaceId
                            )
                            .then((refPath) => {
                                if (
                                    this.featureIndex != null &&
                                    this.featureIndex >= 0
                                ) {
                                    this.addActionService.updateFeatureActionData(
                                        {
                                            type: 'file',
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
                                            fileRef: refPath,
                                        },
                                        true,
                                        this.featureIndex
                                    );
                                }
                            });
                    }
                } else {
                    if (this.fileInput.nativeElement.files) {
                        this.addActionService
                            .uploadActionFile(
                                this.fileInput.nativeElement.files,
                                this.workspaceId
                            )
                            .then((refPath) => {
                                this.addActionService.updateReleaseActionData(
                                    {
                                        type: 'file',
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
                                        fileRef: refPath,
                                    },
                                    true
                                );
                            });
                    }
                }
                break;
            case 'gallery':
                if (this.featureIndex != null && this.featureIndex >= 0) {
                    this.addActionService
                        .uploadFiles(
                            this.selectedFiles,
                            this.userService.userUid,
                            this.workspaceId
                        )
                        .then((files) => {
                            if (
                                this.featureIndex != null &&
                                this.featureIndex >= 0
                            ) {
                                this.addActionService.updateFeatureActionData(
                                    {
                                        type: 'gallery',
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
                                        filesPath: files,
                                    },
                                    true,
                                    this.featureIndex
                                );
                            }
                        });
                } else {
                    this.addActionService
                        .uploadFiles(
                            this.selectedFiles,
                            this.userService.userUid,
                            this.workspaceId
                        )
                        .then((files) => {
                            this.addActionService.updateReleaseActionData(
                                {
                                    type: 'gallery',
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
                                    filesPath: files,
                                },
                                true
                            );
                        });
                }
                break;
        }
        if (
            this.actionTypeCheck != 'file' &&
            this.actionTypeCheck != 'gallery'
        ) {
            this.addActionService.isAddActionVisible = false;
            this.second = 0;
            this.minute = 0;
            this.hour = 0;
            this.muted = false;
            this.autoPlay = false;
            this.link = '';
        }
    }

    /**
     * Close the add action modal.
     */
    closeAddAction(): void {
        this.addActionService.isAddActionVisible = false;
    }

    /**
     * Reset add-action values.
     */
    resetData(): void {
        if (this.actionTypeCheck == 'uploadVideo') {
            this.getUploadForm();
        }
        this.second = 0;
        this.minute = 0;
        this.hour = 0;
        this.muted = false;
        this.autoPlay = false;
        this.link = '';
        this.addActionService.uploadPercent = 0;
        this.addActionService.uploadFilesPercent = 0;
    }

    /**
     *
     * @param e Select file event.
     */
    updateSelectedFiles({ currentFiles }: { currentFiles: File[] }) {
        this.selectedFiles = currentFiles;
    }

    /**
     *
     * @param e Uplodad progress data.
     */
    progressReport(e: number) {
        this.fileuploader.progress = e;
    }

    /**
     * Search vimeo video.
     * @param data Data
     */
    searchVimeoVideo(data: string): void {
        this.videoListExist = true;
        this.searchingActive = true;
        this.vimeoService.searchVideo(data).then((videoList) => {
            this.searchingActive = false;
            console.log(videoList);
            this.videoList = videoList;
        });
    }

    /**
     * Select a vimeo video.
     * @param link Vimeo video link
     */
    selectVideo(link: string) {
        this.link = link;
        this.videoListExist = false;
        this.videoList = {} as VimeoVideoList;
    }

    /**
     * ngAfterViewInit
     */
    ngAfterViewInit(): void {
        this.searchVideoWatcher = fromEvent(
            this.searchVideo.nativeElement,
            'input'
        )
            .pipe(
                map((event) => {
                    const inputEvent = event as InputEvent;
                    return (inputEvent.target as HTMLInputElement).value;
                })
            )
            .pipe(debounceTime(1000))
            .pipe(distinctUntilChanged())
            .subscribe((data: string) => this.searchVimeoVideo(data));
    }

    /**
     * Get upload form.
     */
    getUploadForm(): void {
        this.vimeoService.getUploadForm().then((data) => {
            if (data) {
                console.log(data);

                this.uploadForm = this.sanitizer.bypassSecurityTrustHtml(
                    data.upload.form
                );
            }
        });
    }

    /**
     * Paginator
     * @param e Event
     */
    paginate(e: { page: number }) {
        console.log(e);
        this.searchVimeoVideo(
            `${this.searchVideo.nativeElement.value}&page=${e.page + 1}`
        );
    }

    /**
     * ngOnDestroy.
     */
    ngOnDestroy(): void {
        this.uploadPercentWatcher?.unsubscribe();
        this.searchVideoWatcher?.unsubscribe();
    }
}
