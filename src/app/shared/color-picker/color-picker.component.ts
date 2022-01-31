import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {faPalette} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})

/**
 * Color picker component.
 */
export class ColorPickerComponent implements OnInit {

    pickColor = faPalette;
    @Input() color = '';
    @Input() colorIndex = 0;

    @Output() setColor = new EventEmitter<string>();

    paletteColors = [
        {
            name: 'Light Gray',
            color: '#D3D3D3',
        },
        {
            name: 'Gray',
            color: '#808080',
        },
        {
            name: 'Brown',
            color: '#964B00',
        },
        {
            name: 'Orange',
            color: '#FFA500',
        },
        {
            name: 'Yellow',
            color: '#FFFF00',
        },
        {
            name: 'Green',
            color: '#00FF00',
        },
        {
            name: 'Blue',
            color: '#0000FF',
        },
        {
            name: 'Purple',
            color: '#CC8899',
        },
        {
            name: 'Pink',
            color: '#FFC0CB',
        },
        {
            name: 'Red',
            color: '#FF0000',
        },
    ];

    /**
     * Constructor.
     */
    constructor() {}

    /**
     * ngOnInit.
     */
    ngOnInit(): void {}

    /**
     * Tag color picker.
     * @param e Click event.
     * @param tagColor Tag color.
     */
    pickTagColor(e: Event, tagColor: string): void {
        e.preventDefault();
        this.setColor.emit(tagColor);
    }
}
