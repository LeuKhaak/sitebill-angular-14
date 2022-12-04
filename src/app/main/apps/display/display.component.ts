import {AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {SitebillEntity} from "../../../_models";
import {Subject} from "rxjs";

@Component({
    selector: 'display-apps',
    templateUrl: './display.component.html',
    styleUrls: ['./display.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class DisplayComponent  implements OnInit, AfterViewChecked {
    protected _unsubscribeAll: Subject<any>;
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    @Input("messages")
    messages: any[];

    constructor(
    ) {
        this._unsubscribeAll = new Subject();

    }


    ngOnInit() {
        console.log(this.messages);
        this.scrollToBottom();
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }
    }


    OnDestroy () {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
