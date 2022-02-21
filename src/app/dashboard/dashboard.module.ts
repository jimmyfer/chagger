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
import { TagsBoardComponent } from './views/tags-board/tags-board.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '../shared/shared.module';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import {SplitButtonModule} from 'primeng/splitbutton';
import { AddFeatureComponent } from './views/add-feature/add-feature.component';
import {PaginatorModule} from 'primeng/paginator';


@NgModule({
    declarations: [
        ConsoleComponent,
        AddActionComponent,
        ReleasesBoardComponent,
        FeaturesBoardComponent,
        TagsBoardComponent,
        AddFeatureComponent
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
        SharedModule,
        FileUploadModule,
        SplitButtonModule,
        HttpClientModule,
        PaginatorModule
        
        
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