import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { Subscription } from 'rxjs';
import { AddActionService } from 'src/app/services/add-action.service';

@Component({
    selector: 'app-add-action',
    templateUrl: './add-action.component.html',
    styleUrls: ['./add-action.component.scss'],
})

/**
 * Add action modal.
 */
export class AddActionComponent implements OnInit {

    @ViewChild('actionType', { static: false }) actionType: ElementRef =
        {} as ElementRef;
    @ViewChild('fileuploader', {static: false}) fileuploader: FileUpload = {} as FileUpload;
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
        // if(this.addActionService.uploadPercent == 100){
        //     this.addActionService.isAddActionVisible = false;
        //     this.second = 0;
        //     this.minute = 0;
        //     this.hour = 0;
        //     this.muted = false;
        //     this.autoPlay = false;
        //     this.link = '';
        // }
        return Math.round(this.addActionService.uploadPercent);
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
    constructor(private addActionService: AddActionService) {}

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
                            .uploadFile(this.fileInput.nativeElement.files)
                            .then((fileData) => {
                                if (this.featureIndex) {
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
                                            fileRef: fileData.ref.fullPath,
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
                            .uploadFile(this.fileInput.nativeElement.files)
                            .then((fileData) => {
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
                                        fileRef: fileData.ref.fullPath,
                                    },
                                    true
                                );
                            });
                    }
                }
                break;
            case 'gallery':
                console.log(this.selectedFiles);
                this.addActionService
                    .uploadFiles(this.selectedFiles)
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
                break;
        }
        if (this.actionTypeCheck != 'file' && this.actionTypeCheck != 'gallery') {
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
    }

    /**
     *
     * @param e event
     */
    updateSelectedFiles({ currentFiles }: { currentFiles: File[] }) {
        this.selectedFiles = currentFiles;
    }

    /**
     * 
     * @param e e
     */
    progressReport(e: any) {
        this.fileuploader.progress = e;
    }

    /**
     * ngOnDestroy.
     */
    ngOnDestroy(): void {
        this.uploadPercentWatcher?.unsubscribe();
    }
}
