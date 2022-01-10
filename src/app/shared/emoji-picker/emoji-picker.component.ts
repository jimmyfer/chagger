import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmojiID } from 'src/app/models/models';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-emoji-picker',
    templateUrl: './emoji-picker.component.html',
    styleUrls: ['./emoji-picker.component.scss'],
    providers: [NgbDropdownConfig]
})

/**
 * Emoji Picker integrated with bootstrap dropdown.
 */
export class EmojiPickerComponent {

    

    @Input() selectedEmoji = '';

    @Output() setEmoji = new EventEmitter<string>();

    /**
     * Constructor.
     * @param dropdownConfig Dropdown object configuration.
     */
    constructor(
        dropdownConfig: NgbDropdownConfig
    ) {
        dropdownConfig.autoClose = false;
    }

    /**
     * 
     * @param data Data of the emoji selected.
     */
    addEmoji(data: EmojiID): void {
        this.setEmoji.emit(data.emoji.id);
    }
}
