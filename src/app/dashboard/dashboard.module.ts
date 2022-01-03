import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsoleComponent } from './views/console/console.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddActionComponent } from './views/add-action/add-action.component';
import { ReleasesBoardComponent } from './views/releases-board/releases-board.component';
import { FeaturesBoardComponent } from './views/features-board/features-board.component';

@NgModule({
    declarations: [
        ConsoleComponent,
        AddActionComponent,
        ReleasesBoardComponent,
        FeaturesBoardComponent
    ],
    imports: [
        CommonModule,
        FontAwesomeModule,
        DashboardRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        ConfirmDialogModule
    ],
    providers: [
        ConfirmationService
    ]
})
export class DashboardModule {}