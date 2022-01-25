import { Component, OnInit } from '@angular/core';
import { faCopy, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { SharedChangelogService } from 'src/app/services/shared-changelog.service';

@Component({
    selector: 'app-changelog-share',
    templateUrl: './changelog-share.component.html',
    styleUrls: ['./changelog-share.component.scss'],
})

/**
 * Share Changlog Component.
 */
export class ChangelogShareComponent implements OnInit {

    copyCode = faCopy;
    openLink = faExternalLinkAlt;

    changelogCode = '';

    activeButton = '';

    buttonLabel = 'Chagger';

    /**
     * Link.
     */
    get link(): string {
        return this.sharedChangelog.link;
    }

    /**
     * Constructor.
     */
    constructor(
        private sharedChangelog: SharedChangelogService,
        private messageService: MessageService
    ) {}

    /**
     * ngOnInit
     */
    ngOnInit(): void {
    }

    /**
     * Open changelog link.
     * @param e Click event.
     */
    openChangelogLink(e: Event): void {
        e.preventDefault();
        window.open(this.link, '_blank')?.focus();
    }

    /**
     * Change shared code to embed code.
     */
    getEmbedCode(): void {
        const code = `<iframe width="600" height="800" src="${this.link}" title="Chagger change log!"></iframe>
        `;
        this.activeButton = 'Embed';
        this.changelogCode = code;
    }

    /**
     * Change shared code to button code.
     */
    buttonCode(): void {
        const code = `<a href="${this.link}" style="background-color: #e28063; padding: 7px 15px;font-size: 18px;border: 1px solid #facfc2;color: #ffffff;cursor: pointer;border-radius: 5px;margin: 2px;text-decoration: none;" onmouseover='this.style.backgroundColor="#de4c36"' onmouseout='this.style.backgroundColor="#e28063"' > ${this.buttonLabel} </a>`;
        this.activeButton = 'Button';
        this.changelogCode = code;
    }

    /**
     * Copy link to clipboard.
     */
    copyLink(): void {
        navigator.clipboard.writeText(this.link);
        this.messageService.clear();
        this.messageService.add({severity:'success', summary:'Done', detail:'Link copied!'});
    }

    /**
     * Copy code to clipboard.
     */
    copyChangelogCode(): void {
        navigator.clipboard.writeText(this.changelogCode);
        this.messageService.clear();
        this.messageService.add({severity:'success', summary:'Done', detail:'Changelog code copied!'});
    }
}
