import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileUpload } from 'primeng/fileupload';
import { Subscription } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { AddActionService } from 'src/app/services/add-action.service';
import { UserService } from 'src/app/services/user.service';

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

    @ViewChild('actionType', { static: false }) actionType: ElementRef =
        {} as ElementRef;
    @ViewChild('fileuploader', { static: false }) fileuploader: FileUpload =
        {} as FileUpload;
    @ViewChild('fileInput', { static: false })
    fileInput: ElementRef<HTMLInputElement> = {} as ElementRef;

    actionTypeCheck = 'video';

    featureIndex = this.addActionService.featureIndex;

    seconds: number[] = [];
    minutes: number[] = [];
    hours: number[] = [];

    selectedFiles: File[] = [];

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


    uploadPercentWatcher: Subscription | null = null;

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
        private route: ActivatedRoute
    ) {}

    /**
     * Angular OnInit.
     */
    ngOnInit(): void {
        this.seconds = Array(60)
            .fill(1)
            .map((x, i) => i);
        this.minutes = Array(60)
            .fill(1)
            .map((x, i) => i);
        this.hours = Array(11)
            .fill(1)
            .map((x, i) => i);
        if(this._workspaceId) {
            this._workspaceId.pipe(first()).toPromise().then(workspaceId => {
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
                            .uploadActionFile(this.fileInput.nativeElement.files, this.workspaceId)
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
                            .uploadActionFile(this.fileInput.nativeElement.files, this.workspaceId)
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
                console.log(this.selectedFiles);
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
                            console.log(files);
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
     * ngOnDestroy.
     */
    ngOnDestroy(): void {
        this.uploadPercentWatcher?.unsubscribe();
    }
}
