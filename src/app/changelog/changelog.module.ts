import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangelogComponent } from './views/changelog/changelog.component';
import { ChangeLogRoutingModule } from './changelog-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReleaseChangelogComponent } from './views/release-changelog/release-changelog.component';

@NgModule({
    declarations: [
        ChangelogComponent,
        ReleaseChangelogComponent
    ],
    imports: [
        CommonModule,
        ChangeLogRoutingModule,
        SharedModule
    ],
})

/**
 * Changelog Module.
 */
export class ChangelogModule {}
