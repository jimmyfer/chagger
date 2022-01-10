import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsoleComponent } from './views/console/console.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddActionComponent } from './views/add-action/add-action.component';
import { ReleasesBoardComponent } from './views/releases-board/releases-board.component';
import { FeaturesBoardComponent } from './views/features-board/features-board.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import {ToastModule} from 'primeng/toast';
import { ButtonActionComponent } from '../shared/button-action/button-action.component';
import { VideoPlayerComponent } from '../shared/video-player/video-player.component';
import { TagsBoardComponent } from './views/tags-board/tags-board.component';
import { EmojiPickerComponent } from '../shared/emoji-picker/emoji-picker.component';
import { NgbDropdownConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [
        ConsoleComponent,
        AddActionComponent,
        ReleasesBoardComponent,
        FeaturesBoardComponent,
        ButtonActionComponent,
        VideoPlayerComponent,
        TagsBoardComponent,
        EmojiPickerComponent
    ],
    imports: [
        CommonModule,
        FontAwesomeModule,
        DashboardRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        ConfirmDialogModule,
        PickerModule,
        EmojiModule,
        ToastModule,
        NgbModule
    ],
    providers: [
        ConfirmationService,
        MessageService
    ]
})

/**
 * DashboardModule.
 */
export class DashboardModule {}