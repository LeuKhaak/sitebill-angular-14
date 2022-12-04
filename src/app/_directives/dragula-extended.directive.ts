import { Directive, OnChanges, AfterViewInit, EventEmitter, OnInit, Output, Input, OnDestroy, ElementRef, SimpleChange } from '@angular/core';
import { dragula, DragulaService, Group } from 'ng2-dragula';
import {moveItemInArray} from "@angular/cdk/drag-drop";

@Directive({ selector: 'ngx-datatable[dragulaName]' })
export class DragulaExtendedDirective implements OnChanges, OnInit, AfterViewInit, OnDestroy {
    @Input() public dragulaName: string;
    @Input() public dragulaModel: any;
    @Input() public classSelector: string = 'null';
    @Output() public directiveDrop: EventEmitter<any> = new EventEmitter<any>();
    @Output() public directiveDrag: EventEmitter<any> = new EventEmitter<any>();

    protected container: any;
    private drake: any;
    private options: any;
    private el: ElementRef;
    private dragulaService: DragulaService;
    subscriptionDrag: any = null;
    subscriptionDrop: any = null;

    public constructor(el: ElementRef, dragulaService: DragulaService) {
        this.el = el;
        this.dragulaService = dragulaService;
    }
    ngOnInit(){

    }

    ngAfterViewInit() {
        if(this.el){
            let container = this.el;

            // Check for the row's parent node: datatable-scroller
            // This is what you want to bind Dragula to, in order to drag sort
            if(container.nativeElement.querySelector('datatable-scroller')){
                let rowParent =  container.nativeElement.querySelector('datatable-scroller');

                // Check if this Dragula already exists
                if( !this.dragulaService.find(this.dragulaName) ){

                    // Must assign the new rowParent as the container you want to pass to Dragula
                    this.container = rowParent;
                    this.initializeDragula();
                }
            }
        }
    }

    ngOnDestroy() {

        // Clear this Dragula always
        // comment out if you want to keep it
        if (this.dragulaService.find(this.dragulaName)) {
            this.dragulaService.destroy(this.dragulaName);
        }

        // Clear DRAG and DROP subscription to prevent duplicates
        if(this.subscriptionDrag){
            this.subscriptionDrag.unsubscribe();
            this.subscriptionDrag = null;
        }
        if(this.subscriptionDrop){
            this.subscriptionDrop.unsubscribe();
            this.subscriptionDrop = null;
        }
    }

    protected initializeDragula(){
        // Create new Dragula container
        let bag = this.dragulaService.find(this.dragulaName);
        if (bag) {
            this.drake = bag.drake;
            this.checkModel();
            this.drake.containers.push(this.container);
        } else {

            // Check if classSelector was specified
            // *true:
            //    - the classSelector string will be used to match the class of the element clicked
            //    - the element with the matching class name will be used to drag the row
            // *false:
            //    - no class selector will be used
            //    - the whole row will default back to being draggable
            if(this.classSelector != 'null'){
                let classSelector = this.classSelector;
                let options = {
                    moves: function (el, container, handle) {
                        return handle.className === classSelector;
                    }
                };
                this.drake = dragula([this.container], options);
            }else{
                this.drake = dragula([this.container]);
            }
            this.checkModel();
            let group = new Group(this.dragulaName , this.drake , this.options);
            this.dragulaService.add(group);
        }

        // Set DRAG and DROP subscriptions and callbacks
        this.subscriptionDrop = this.dragulaService.drop(this.dragulaName).subscribe(({ name ,el ,source , target , sibling}) => {
            this.onDropModel([el , source , target, sibling, name]);
        });
    }

    private checkModel(){
        if (this.dragulaModel) {
            if (this.drake.models) {
                this.drake.models.push(this.dragulaModel);
            } else {
                this.drake.models = [this.dragulaModel];
            }
        }
    }

    private drag(args) {
        let [e, el] = args;
    }

    private onDropModel(args) {
        let [el, target, source, siblings, name] = args;
        let index = 0;

        // Added emitter on any DROP action
        let fromIndex = el.children[0].getAttribute('ng-reflect-row-index');
        let toIndex = siblings.children[0].getAttribute('ng-reflect-row-index');
        moveItemInArray(
            this.dragulaModel,
            fromIndex,
            toIndex
        );

        for (let item of target.children) {
            item.children[0].setAttribute('ng-reflect-row-index', index);
            index++;
        }
        this.directiveDrop.emit(this.dragulaModel);
    }

    public ngOnChanges(changes: { dragulaModel?: SimpleChange }): void {

        // Must update model on any changes
        // Otherwise it will fall out of sync with the 'dragulaModel'
        if (changes && changes.dragulaModel) {
            if (this.drake) {
                if (this.drake.models) {
                    let modelIndex = this.drake.models.indexOf(changes.dragulaModel.previousValue);
                    this.drake.models.splice(modelIndex, 1, changes.dragulaModel.currentValue);
                } else {
                    this.drake.models = [changes.dragulaModel.currentValue];
                }
            }
        }
    }
}
