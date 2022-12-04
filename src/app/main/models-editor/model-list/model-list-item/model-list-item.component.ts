import { Component, HostBinding, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {SitebillEntity} from "../../../../_models";
import {ModelsEditorService} from "../../models-editor.service";

@Component({
    selector     : 'model-list-item',
    templateUrl  : './model-list-item.component.html',
    styleUrls    : ['./model-list-item.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ModelListItemComponent implements OnInit, OnDestroy
{
    tags: any[];

    @Input()
    model: SitebillEntity;

    @HostBinding('class.selected')
    selected: boolean;

    @HostBinding('class.completed')
    completed: boolean;

    @HostBinding('class.move-disabled')
    moveDisabled: boolean;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     */
    constructor(
        protected _modelsEditorService: ModelsEditorService,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Set the initial values
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On selected change
     */
    onSelectedChange(): void
    {
        // this._todoService.toggleSelectedTodo(this.todo.id);
    }

    /**
     * Toggle star
     */
    toggleStar(event): void
    {
        event.stopPropagation();

        // this.todo.toggleStar();
        // this._todoService.updateTodo(this.todo);
    }

    /**
     * Toggle Important
     */
    toggleImportant(event): void
    {
        event.stopPropagation();

        // this.todo.toggleImportant();
        // this._todoService.updateTodo(this.todo);
    }

    /**
     * Toggle Completed
     */
    toggleCompleted(event): void
    {
        event.stopPropagation();

        // this.todo.toggleCompleted();
        // this._todoService.updateTodo(this.todo);
    }
}
