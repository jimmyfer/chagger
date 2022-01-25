import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { WorkspaceTags } from 'src/app/models/workspace.interface';
import { TagsService } from 'src/app/services/tags.service';
import { WorkspaceService } from 'src/app/services/workspace.service';

import { faPalette } from '@fortawesome/free-solid-svg-icons';

import { ConfirmationService } from 'primeng/api';
import { Tags } from 'src/app/models/tags.interface';

@Component({
    selector: 'app-tags-board',
    templateUrl: './tags-board.component.html',
    styleUrls: ['./tags-board.component.scss'],
})

/**
 * Tags board component.
 */
export class TagsBoardComponent implements OnInit {
    tags$: Observable<WorkspaceTags[]> = this.route.paramMap.pipe(
        map((params) => params.get('workspaceId')),
        filter((workspaceId): workspaceId is string => !!workspaceId),
        switchMap((workspaceId) =>
            this.workspaceService.getWorkspaceTags(workspaceId)
        )
    );

    @ViewChild('addTagInput', { static: false })
    addTagInput: ElementRef<HTMLInputElement> = {} as ElementRef;

    @ViewChild('editTagInput', { static: false })
    editTagInput: ElementRef<HTMLInputElement> = {} as ElementRef;

    pickColor = faPalette;

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

    editTag: boolean[] = [];
    editTagWorking = false;

    addTag = false;
    addTagWorking = false;

    tags: WorkspaceTags[] = [];
    /**
     * Get the actual workspace.
     */
    get activeWorkspace(): DocumentReference {
        const workspaceId = this.route.snapshot.paramMap.get('workspaceId');
        if (workspaceId) {
            return this.workspaceService.getReference(workspaceId);
        }
        throw 'Workspace ID not exist!';
    }

    /**
     * Get the actual workspaceId
     */
    get workspaceId(): string | null {
        const workspaceId = this.route.snapshot.paramMap.get('workspaceId');
        if (workspaceId) {
            return workspaceId;
        }
        return null;
    }

    /**
     * Constructor.
     */
    constructor(
        private workspaceService: WorkspaceService,
        private tagsService: TagsService,
        private confirmationService: ConfirmationService,
        private route: ActivatedRoute
    ) {}

    /**
     * ngOnInit.
     */
    ngOnInit(): void {
        this.tags$.subscribe((tags) => {
            this.tags = tags;
        });
    }

    /**
     * Tag title toggler from text to input and edit the tag name.
     * @param e Click, Focus and Enter Key event handler.
     * @param tagIndex Tag index.
     */
    editTagName(e: Event, tagIndex: number): void {
        e.preventDefault();
        switch (e.type) {
            case 'click':
                this.editTag[tagIndex] = true;
                setTimeout(() => {
                    this.editTagInput.nativeElement.focus();
                });
                break;
            case 'blur':
                if (!this.editTagWorking) {
                    this.editTag[tagIndex] = false;
                    this.updateTag(
                        '#' + this.editTagInput.nativeElement.value,
                        this.tags[tagIndex],
                        this.tags
                    );
                }
                this.editTagWorking = false;
                break;
            case 'keyup':
                this.editTag[tagIndex] = false;
                this.editTagWorking = true;
                this.updateTag(
                    '#' + this.editTagInput.nativeElement.value,
                    this.tags[tagIndex],
                    this.tags
                );
                break;
        }
    }

    /**
     * Update the selected release.
     * @param newTagName New release name.
     * @param data Tag data.
     * @param tags Actual workspace tags.
     */
    updateTag(
        newTagName: string,
        data: WorkspaceTags,
        tags: WorkspaceTags[]
    ): void {
        const workspace = this.activeWorkspace;
        if (!workspace) {
            return;
        }
        this.tagsService.updateTag(
            {
                name: newTagName,
                emojiId: data.emojiId,
                color: data.color,
            },
            data.name,
            workspace.id,
            data.ref.id,
            { tags: tags }
        );
    }

    /**
     * Detele the selected tag.
     * @param e Click event handler.
     * @param tagIndex Tag index.
     */
    deleteTag(e: Event, tagIndex: number) {
        e.preventDefault();
        const workspace = this.activeWorkspace;
        if (!workspace) {
            return;
        }
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this tag?',
            accept: () => {
                this.tagsService.deleteTag(
                    this.tags[tagIndex].ref.path,
                    workspace.id,
                    { tags: this.tags },
                    this.tags[tagIndex].name
                );
            },
        });
    }

    /**
     * New tag interface toggler from link to input and vice versa.
     * @param e Click, Focus and Enter Key event handler.
     */
    newTag(e: Event): void {
        e.preventDefault();
        switch (e.type) {
            case 'click':
                this.addTag = true;
                setTimeout(() => {
                    this.addTagInput.nativeElement.focus();
                });
                break;
            case 'blur':
                if (!this.addTagWorking) {
                    this.addTag = false;
                    this.addNewTag(this.addTagInput.nativeElement.value);
                }
                this.addTagWorking = false;
                break;
            case 'keyup':
                this.addTag = false;
                this.addTagWorking = true;
                this.addNewTag(this.addTagInput.nativeElement.value);
                break;
        }
    }

    /**
     * Add new tag to Database.
     * @param tagName Tag name.
     */
    addNewTag(tagName: string): void {
        if(this.workspaceId) {
            this.tagsService.addNewTag(
                {
                    name: '#' + tagName,
                    emojiId: 'label',
                    color: '#D3D3D3',
                },
                this.workspaceId,
                { tags: this.tags }
            );
        } else {
            console.warn('There is not any workspace ID');
        }
    }

    /**
     *
     * @param emojiId Emoji ID.
     * @param tagIndex Tag Index.
     */
    addEmoji(emojiId: string, tagIndex: number): void {
        if (this.workspaceId) {
            this.tagsService.updateTag(
                {
                    name: this.tags[tagIndex].name,
                    emojiId: emojiId,
                    color: this.tags[tagIndex].color,
                },
                this.tags[tagIndex].name,
                this.workspaceId,
                this.tags[tagIndex].ref.id,
                {
                    tags: this.tags,
                }
            );
        }else {
            console.warn('There is not any workspace ID.');
        }
    }

    /**
     * Tag color picker.
     * @param e Click event.
     * @param tagColor Tag color.
     * @param tagIndex Tag index.
     */
    pickTagColor(e: Event, tagColor: string, tagIndex: number): void {
        e.preventDefault();
        if(this.workspaceId) {
            this.tagsService.updateTag(
                {
                    name: this.tags[tagIndex].name,
                    emojiId: this.tags[tagIndex].emojiId,
                    color: tagColor,
                },
                this.tags[tagIndex].name,
                this.workspaceId,
                this.tags[tagIndex].ref.id,
                {
                    tags: this.tags,
                }
            );
        }else {
            console.warn('There is not any workspace ID');
        }
    }
}
