import { Component, OnInit } from '@angular/core';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    host: { class: 'flex-grow-1' },
})

/**
 * Main component of the console integrations.
 */
export class MainComponent implements OnInit {

    active = false;

    /**
     * Consturctor
     */
    constructor() {}

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        setTimeout(() => {
            this.active = true;
        }, 200);
    }
}
