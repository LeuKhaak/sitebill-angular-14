import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FuseMatchMediaService
{
    activeMediaQuery: string;
    onMediaChange: BehaviorSubject<string> = new BehaviorSubject<string>('');

    /**
     * Constructor
     *
     * @param {MediaObserver} _mediaObserver
     */
    constructor(
        private _mediaObserver: MediaObserver
    )
    {
        // Set the defaults
        this.activeMediaQuery = '';

        // Initialize
        this._init();

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Initialize
     *
     * @private
     */
    private _init(): void
    {
        this._mediaObserver
            .asObservable()
            .pipe(
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe((changes: MediaChange[]) => {
                if ( this.activeMediaQuery !== changes[0].mqAlias ) // ????????????????????????????
                {
                    this.activeMediaQuery = changes[0].mqAlias;
                    this.onMediaChange.next(changes[0].mqAlias);
                }
            });
    }

}
