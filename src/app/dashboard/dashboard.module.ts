import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsoleComponent } from './views/console/console.component';
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
import { TagsBoardComponent } from './views/tags-board/tags-board.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        ConsoleComponent,
        AddActionComponent,
        ReleasesBoardComponent,
        FeaturesBoardComponent,
        TagsBoardComponent
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        ConfirmDialogModule,
        DragDropModule,
        SharedModule
        
        
    ],
    providers: [
        ConfirmationService,
        MessageService
    ]
})

/**
 * 
 */
export class DashboardModule {}