import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'angular-content',
    templateUrl  : './content.component.html',
    styleUrls    : ['./content.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContentComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
