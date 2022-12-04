import {Component, Inject, Input} from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import {ModelService} from "../../../_services/model.service";
import {HouseSchemaService} from "../services/houseschema.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {SitebillEntity} from "../../../_models";
import {FormComponent} from "../../grid/form/form.component";
import {NgxGalleryImage} from "ngx-gallery-9";
import {SafeResourceUrl} from "@angular/platform-browser";
import { fabric } from "fabric";
import {LabelSelectorComponent} from "./modal/label-selector/label-selector.component";
import {labelColors, LevelLocationModel} from "../models/level-location.model";
import {LevelModel} from "../models/level.model";
import {SectionModel} from "../models/section.model";
import {StairModel} from "../models/stair.model";
// import {element} from "protractor";
import {SnackService} from "../../../_services/snack.service";
import {FilterService} from "../../../_services/filter.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {delay, takeUntil} from "rxjs/operators";

@Component({
    selector   : 'house-schema-builder',
    templateUrl: './house-schema-builder.component.html',
    styleUrls  : ['./house-schema-builder.component.scss']
})
export class HouseSchemaBuilderComponent
{
    public canvas: any;
    public textString: string;
    private size: any = {
        width: 1000,
        height: 600
    };
    public OutputContent: string;
    public label_entity: SitebillEntity;
    public input_entity: SitebillEntity;

    @Input("_data")
    _data: {
        entity: SitebillEntity,
        image_field: string,
        image_index: number,
        galleryImages: NgxGalleryImage[],
    }

    schema_url: SafeResourceUrl;
    private field_name: string;
    private current_position: number;
    private level: LevelModel;

    form: FormGroup;
    private _unsubscribeAll: Subject<any>;


    /**
     * Constructor
     *
     */
    constructor(
        private modelService: ModelService,
        protected dialog: MatDialog,
        private houseSchemaService: HouseSchemaService,
        protected _snackService: SnackService,
        public filterService: FilterService,
        private _formBuilder: FormBuilder
    )
    {
        this._unsubscribeAll = new Subject();

        this.initLabelEntity();
    }

    initLabelEntity() {
        this.label_entity = new SitebillEntity();
        this.label_entity.set_app_name('labels');
        this.label_entity.set_table_name('labels');
        this.label_entity.set_primary_key('id');
    }


    ngOnInit() {
        if ( this._data ) {
            const image_index = this._data.image_index;
            this.schema_url = this._data.galleryImages[image_index].big;
            this.input_entity = this._data.entity;
            this.field_name = this._data.image_field;
            this.setCurrentPosition(this._data.image_index);
            // console.log(this._data);
        } else {
            console.error('SitebillEntity undefined');
        }

        this.canvas = new fabric.Canvas('canvas', {
            hoverCursor: 'pointer',
            selection: true,
            selectionBorderColor: 'blue',
        });
        this.canvas.setWidth(this.getWidth(''));
        this.canvas.setHeight(this.getHeight(''));

        this.textString = null;
        this.OutputContent = null;
        this.initForm();
        this.load_level();

        this.filterService.share
            .pipe(
                delay(500),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((entity: SitebillEntity) => {
            if (entity.get_app_name() == this.label_entity.get_app_name()) {
                // console.log(entity);
                // console.log(entity.get_ql_items());
                if (entity.get_hook() === 'afterDelete' && entity.get_param('canvas_id')) {
                    this.removeCanvasLabel(entity.get_param('canvas_id'));
                } else if (entity.get_ql_items() && entity.get_param('canvas_id')) {
                    this.setLabelId(entity.get_param('canvas_id'), entity.get_key_value());
                    if (entity.get_ql_items().building_blocks_id) {
                        this.setBuildingBlocksId(
                            entity.get_param('canvas_id'),
                            entity.get_ql_items().building_blocks_id
                        );
                        this.changeCanvasText(
                            entity.get_param('canvas_id'),
                            entity.get_ql_items().building_blocks_id,
                            labelColors.building_blocks
                        );
                    } else if(entity.get_ql_items().realty_id) {
                        this.setRealtyId(entity.get_param('canvas_id'), entity.get_ql_items().realty_id);
                        this.changeCanvasText(entity.get_param('canvas_id'), entity.get_ql_items().realty_id);
                    }
                    this.updateImageLevel('after subscribe to save');
                }
            }
        });
    }

    initForm () {
        this.form = this._formBuilder.group({
            level_name : ['', Validators.required],
        });

        this.form.valueChanges
            .pipe(
                delay(500),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(val => {
            this.updateImageLevel('subscribe to initForm');
        });
    }

    changeCanvasText( id:number, text:string, color = labelColors.realty ) {
        this.canvas.getObjects().forEach(item => {
            if (item.toObject().id === id) {
                item._objects[0].set("fillColor", color);
                item._objects[0].set("fill", color);
                item._objects[0].set("radius", 21);
                item._objects[1].set("text", text);
            }
        })
        this.refreshLabel(id);
    }

    refreshLabel(id:number) {
        this.canvas.getObjects().forEach(item => {
            if (item.toObject().id === id) {
                item._objects[0].set("radius", this.getRadius()+1);
            }
        })
        this.canvas.renderAll();
        this.canvas.getObjects().forEach(item => {
            if (item.toObject().id === id) {
                item._objects[0].set("radius", this.getRadius());
            }
        })
        this.canvas.renderAll();
    }

    load_level() {
        this.level = new LevelModel({
            id: this.getCurrentPosition(),
            title: '',
            locations: null
        });


        this.houseSchemaService
            .load_level(this.input_entity, this.getFieldName(), this.getCurrentPosition())
            .pipe(
                delay(500),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((result: any) => {
            if ( result.status === 'ok' ) {
                this.level.title = result.level.title;
                if ( result.level.mapwidth ) {
                    this.size.width = result.level.mapwidth;
                }
                if (result.level.mapheight) {
                    this.size.height = result.level.mapheight;
                }

                this.canvas.setWidth(this.getWidth(''));
                this.canvas.setHeight(this.getHeight(''));

                if ( result.level.locations ) {


                    Object.entries(result.level.locations).forEach(
                        ([key, location]) => {

                            if ( location ) {
                                let nlocation = new LevelLocationModel(location);
                                // console.log(location);
                                // console.log(nlocation.getLabelId());
                                if ( nlocation.id ) {
                                    const current_location = new LevelLocationModel({
                                        id: nlocation.id,
                                        title: '',
                                        description: '',
                                        category: '',
                                        x: nlocation.x,
                                        y: nlocation.y,
                                        realty_id: (nlocation.realty_id ? nlocation.realty_id : 0),
                                        building_blocks_id: (nlocation.building_blocks_id ? nlocation.building_blocks_id : 0),
                                        label_id: (nlocation.getLabelId() ? nlocation.getLabelId() : null),
                                    });

                                    this.addLabel(current_location);
                                }
                            }
                        }
                    );
                }
                this.form.controls['level_name'].patchValue(this.level.title);
            }
        });
    }

    removeCanvasLabel (object_id) {
        this.canvas.getObjects().forEach(item => {
            if (item.toObject().id === object_id) {
                this.canvas.remove(item);
            }
        })
        this.canvas.renderAll();
        if ( this.level.locations ) {
            this.level.locations = this.level.locations.filter((element) => {
                if (object_id !== element.id) {
                    return true;
                }
            });
        }
        this.updateImageLevel('removeCanvasLabel');
    }


    addLabel (location: LevelLocationModel) {
        // console.log('add label');
        // console.log(location);

        let circle: any;

        circle = new fabric.Circle({
            radius: this.getRadius(), left: location.x, top: location.y, fill: location.getColor()
        });

        // console.log(location.realty_id);

        let circle_label;
        if ( location.building_blocks_id ) {
            circle_label = location.building_blocks_id;
        } else {
            circle_label = (location.realty_id ? location.realty_id : '?');
        }


        var t = new fabric.Text(circle_label.toString(), {
            fontFamily: 'Calibri',
            fontSize: 12,
            fill: '#000000',
            textAlign: 'center',
            originX: 'center',
            originY: 'center',
            left: location.x + circle.radius,
            top: location.y + circle.radius
        });

        var add = new fabric.Group([circle, t],{
            // any group attributes here
        });

        this.extend(add, location.getId());

        add.on('mousedblclick', function(opt){
            // console.log('mousedblclick fired with opts: ');
            // console.log(opt.target);
            // console.log(opt.target.fill);
            // console.log(opt.target.toObject().id);
            /*
            opt.target.set("fill", '#00e676');
            opt.target.set("fillColor", '#00e676');
             */
            //console.log(this.getLabelId(opt.target.toObject().id));
            this.label_entity.set_key_value(this.getLabelId(opt.target.toObject().id));
            this.label_entity.set_param('canvas_id', opt.target.toObject().id);
            this.label_entity.set_param('realty_id', this.getRealtyId(opt.target.toObject().id));
            this.canvas.renderAll();


            this.editLabel();
        }.bind(this));

        add.on('moved', function(opt){
            //console.log('mouseout fired with opts: ');
            //console.log(opt.target);
            //console.log(opt.target.toObject().id);
            //this.removeCanvasLabel(opt.target.toObject().id);
            this.updateXY(opt.target.toObject().id, opt.target.left, opt.target.top);
        }.bind(this));
        // console.log(add);
        this.canvas.add(add);
        this.selectItemAfterAdded(add);
        this.level.pushLocation(location);
    }

    setRealtyId ( id, realty_id ) {
        if ( this.level.locations ) {
            this.level.locations.forEach((element) => {
                if (id === element.id) {
                    element.setRealtyId(realty_id);
                }
            });
        }
    }

    setBuildingBlocksId ( id, building_blocks_id ) {
        if ( this.level.locations ) {
            this.level.locations.forEach((element) => {
                if (id === element.id) {
                    element.setBuildingBlocksId(building_blocks_id);
                }
            });
        }
    }


    setLabelId ( id, label_id ) {
        if ( this.level.locations ) {
            this.level.locations.forEach((element) => {
                if (id === element.id) {
                    element.setLabelId(label_id);
                }
            });
        }
    }


    getRealtyId ( id ) {
        let realty_id = 0;
        this.level.locations.forEach((element) => {
            if (id === element.id) {
                realty_id = element.getRealtyId();
            }
        });
        return realty_id;
    }

    getBuildingBlocksId ( id ) {
        let building_blocks_id = 0;
        this.level.locations.forEach((element) => {
            if (id === element.id) {
                building_blocks_id = element.getBuildingBlocksId();
            }
        });
        return building_blocks_id;
    }

    getLabelId ( id ) {
        let label_id = 0;
        this.level.locations.forEach((element) => {
            if (id === element.id) {
                label_id = element.getLabelId();
            }
        });
        return label_id;
    }




    addEmptyLabel(top = 10, left = 10) {
        const current_location = new LevelLocationModel({
            id: this.randomId(),
            title: '',
            description: '',
            category: '',
            x: left,
            y: top,
        });
        this.addLabel(current_location);
        this.updateImageLevel('addEmptyLabel');

    }



    updateImageLevel(source) {
        this.level.title = this.form.controls['level_name'].value;
        this.setCurrentPosition(this.getCurrentPosition());
        this.houseSchemaService.update_level(
            this.input_entity,
            this.getFieldName(),
            this.getCurrentPosition(),
            this.level
        ).subscribe((result: any) => {
            if ( result.status === 'error' ) {
                this._snackService.message(result.message, 5000);
            } else {
            }
        });

    }

    editLabel() {
        this.label_entity.set_default_value('object_id', this.input_entity.get_key_value());
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        //dialogConfig.width = '99vw';
        //dialogConfig.maxWidth = '99vw';
        //dialogConfig.data = { app_name: this.entity.get_table_name(), primary_key: this.entity.primary_key, key_value: item_id };
        //this.entity.set_key_value(item_id);
        dialogConfig.data = this.label_entity;
        //console.log(dialogConfig.data);
        dialogConfig.panelClass = 'form-ngrx-compose-dialog';

        //console.log(this.label_entity);


        this.dialog.open(LabelSelectorComponent, dialogConfig);
        this.updateImageLevel('editLabel');
    }

    extend(obj, id) {
        obj.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    id: id
                });
            };
        })(obj.toObject);
    }
    //======= this is used to generate random id of every object ===========
    randomId() {
        return Math.floor(Math.random() * 999999) + 1;
    }
    //== this function is used to active the object after creation ==========
    selectItemAfterAdded(obj) {
        this.canvas.discardActiveObject().renderAll();
        this.canvas.setActiveObject(obj);
    }

    updateXY( id, x, y ) {

        this.level.locations.forEach((element) => {
            if (id === element.id) {
                element.x = x;
                element.y = y;
                // console.log(element);
            }
        });


        this.updateImageLevel('updateXY');
    }
    getWidth(postfix = 'px') {
        return this.size.width + postfix;
    }
    getHeight(postfix = 'px') {
        return this.size.height + postfix;
    }
    getRadius() {
        return 20;
    }

    private getFieldName() {
        return this.field_name;
    }

    private setCurrentPosition( position ) {
        this.current_position = position;
    }

    private getCurrentPosition() {
        return this.current_position;
    }

    ngOnDestroy () {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
