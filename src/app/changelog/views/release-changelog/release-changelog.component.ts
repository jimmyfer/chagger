import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { Feature } from 'src/app/models/feature.interface';
import { Releases } from 'src/app/models/releases.interface';
import { Tags } from 'src/app/models/tags.interface';
import { FeaturesService } from 'src/app/services/features.service';
import { ReleasesService } from 'src/app/services/releases.service';
import { TagsService } from 'src/app/services/tags.service';

@Component({
    selector: 'app-release-changelog',
    templateUrl: './release-changelog.component.html',
    styleUrls: ['./release-changelog.component.scss'],
})

/**
 * Release Changelog component.
 */
export class ReleaseChangelogComponent implements OnInit {

    Color = require('color');

    workspaceId = this.route.parent?.snapshot.paramMap.get('workspaceId');
    releaseId = this.route.snapshot.paramMap.get('releaseId');

    release: Releases = {} as Releases;

    features: Feature[] = [];

    tags: Tags[] = [];

    lastUpdate = '';

    /**
     * Constructor.
     */
    constructor(
        private route: ActivatedRoute,
        private releaseService: ReleasesService,
        private featureService: FeaturesService,
        private tagsService: TagsService
    ) {}

    /**
     * ngOnInit.
     */
    ngOnInit(): void {
        if(this.workspaceId && this.releaseId) {
            this.releaseService.getRelease(this.workspaceId, this.releaseId).then(release => {
                this.release = release;
                if(release._lastUpdate instanceof Timestamp) {
                    this.lastUpdate = this.toDateTime(release._lastUpdate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                }
                if(this.workspaceId) {
                    this.featureService.getFeaturesDocumentsData({ features: this.release.features }, this.workspaceId).then(features => {
                        this.features = features;
                        this.features.forEach((feature, index) => {
                            if(!feature.tag) {
                                this.features.push(feature);
                                this.features.splice(index, 1);
                            }
                        });
                        console.log(this.features);
                    });
                    this.tagsService.getTagsDocumentsData(this.workspaceId).then(tags => {
                        this.tags = tags;
                    });
                }
            });
        }
    }

    /**
     * Return the tag color of the apropiate tag.
     * @param tagName Tag name.
     * @returns Tag color hex.
     */
    getTagColor(tagName: string): string {
        const tagIndex = this.tags.findIndex((tag) => tag.name == tagName);
        const color = this.Color(this.tags[tagIndex].color).lightness(70);
        return color;
    }

    /**
     * Transform second to date.
     * @param secs Seconds.
     * @returns Date.
     */
    toDateTime(secs: Timestamp) {
        const t = new Date(1970, 0, 1);
        t.setSeconds(secs.seconds);
        return t;
    }
}
