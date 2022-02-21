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
import { FormsModule } from '@angular/forms';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { GalleryComponent } from './gallery/gallery.component';
import {GalleriaModule} from 'primeng/galleria';
import { VimeoPlayerComponent } from './vimeo-player/vimeo-player.component';


@NgModule({
    declarations: [
        ButtonActionComponent,
        EmojiPickerComponent,
        VideoPlayerComponent,
        ChangelogShareComponent,
        ColorPickerComponent,
        GalleryComponent,
        VimeoPlayerComponent

    ],
    imports: [
        CommonModule,
        FontAwesomeModule,
        NgbModule,
        PickerModule,
        EmojiModule,
        ToastModule,
        FormsModule,
        GalleriaModule
        
        
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
        ToastModule,
        ColorPickerComponent,
        GalleryComponent,
        VimeoPlayerComponent
    ]
})

/**
 * 
 */
export class SharedModule {}