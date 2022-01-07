import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Action } from 'src/app/models/action';
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
    
    @ViewChild('actionType', {static: false }) actionType: ElementRef = {} as ElementRef;
    actionTypeCheck = 'video';

    seconds: number[] = [];
    minutes: number[] = [];
    hours: number[] = [];

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
        private addActionService: AddActionService
    ) {}

    /**
     * Angular OnInit.
     */
    ngOnInit(): void {
        this.seconds = Array(60).fill(1).map((x, i) => i);
        this.minutes = Array(60).fill(1).map((x, i) => i);
        this.hours = Array(11).fill(1).map((x, i) => i);
    }

    /**
     * 
     * @param e Click event
     */
    returnAction(e: Event): void {
        e.preventDefault();
        switch (this.actionTypeCheck) {
            case 'video':
                this.addActionService.addActionData = {
                    type: this.actionType.nativeElement.value,
                    link: this.link,
                    options: {
                        title: this.title,
                        startOn: {
                            hour: this.hour,
                            minute: this.minute,
                            second: this.second
                        },
                        autoplay: this.autoPlay,
                        muted: this.muted
                    }
                };
                break;
        
            case 'link':
                this.addActionService.addActionData = {
                    type: 'link',
                    link: this.link,
                    options: {
                        title: '',
                        autoplay: false,
                        muted: false,
                        startOn: {
                            hour: 0,
                            minute: 0,
                            second: 0
                        }
                    }
                };
                break;
        }
        this.addActionService.isAddActionVisible = false;
        this.second = 0;
        this.minute = 0;
        this.hour = 0;
        this.muted = false;
        this.autoPlay = false;
        this.link = '';
    }
}
