import { Component, OnInit } from '@angular/core';
import { GalleryService } from 'src/app/services/gallery.service';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { ImagesGallery } from 'src/app/models/models';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
})

/**
 * Gallery component to views Gallery images action.
 */
export class GalleryComponent implements OnInit {

    closeGallery = faTimesCircle;

    /**
     * Images.
     */
    get images(): ImagesGallery[] {
        return this.galleryService.images;
    }

    responsiveOptions = [
        {
            breakpoint: '2024px',
            numVisible: 5
        },
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];
    

    /**
     * Constructor.
     */
    constructor(private galleryService: GalleryService) {}

    /**
     * ngOnInit
     */
    ngOnInit(): void {}

    /**
     * Close gallery.
     * @param e Click event.
     */
    closeGalleryView(e: Event): void {
        e.preventDefault();
        this.galleryService.isGalleryVisible = false;
    }

    /**
     * ngOnDestroy
     */
    ngOnDestroy(): void {
        this.galleryService.images = [];
    }
}
