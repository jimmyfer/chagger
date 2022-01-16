import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonActionComponent } from './button-action/button-action.component';
import { EmojiPickerComponent } from './emoji-picker/emoji-picker.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ToastModule } from 'primeng/toast';
import { ChangelogShareComponent } from './changelog-share/changelog-share.component';

@NgModule({
    declarations: [
        ButtonActionComponent,
        EmojiPickerComponent,
        VideoPlayerComponent,
        ChangelogShareComponent

    ],
    imports: [
        CommonModule,
        FontAwesomeModule,
        NgbModule,
        PickerModule,
        EmojiModule,
        ToastModule
        
    ],
    exports: [
        ButtonActionComponent,
        EmojiPickerComponent,
        VideoPlayerComponent,
        ChangelogShareComponent,
        FontAwesomeModule,
        NgbModule,
        PickerModule,
        EmojiModule,
        ToastModule
    ]
})

/**
 * 
 */
export class SharedModule {}