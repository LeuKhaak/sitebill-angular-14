import {Component, Inject, OnInit, isDevMode, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {FuseConfigService} from '@fuse/services/config.service';
import {ActivatedRoute} from '@angular/router';

import {currentUser} from 'app/_models/currentuser';
import {IImage} from 'ng-simple-slideshow';
import {NguCarousel, NguCarouselConfig, NguCarouselStore} from '@ngu/carousel';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';

import {DOCUMENT} from '@angular/common';
import { ModelService } from 'app/_services/model.service';
//import { WINDOW } from "app/_services/window/services/window.service";
//import { WindowRef } from 'app/_services/window/WindowRef';



@Component({
    selector: 'carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselComponent implements OnInit {
    controlPressed: boolean;
    controlProcessing: boolean;
    key_value: any;
    model_name: any;
    control_name: any;
    item_model: any[];
    item: any[];


    rows: any[];
    records: any[];
    api_url: string;

    imageUrls: (string | IImage)[] = [];
    height: string = '100%';
    minHeight: string = '200px';
    arrowSize: string = '30px';
    showArrows: boolean = true;
    disableSwiping: boolean = false;
    autoPlay: boolean = true;
    autoPlayInterval: number = 3333;
    stopAutoPlayOnSlide: boolean = true;
    debug: boolean = false;
    backgroundSize: string = 'cover';
    backgroundPosition: string = 'center center';
    backgroundRepeat: string = 'no-repeat';
    showDots: boolean = false;
    dotColor: string = '#FFF';
    showCaptions: boolean = true;
    captionColor: string = '#FFF';
    captionBackground: string = 'rgba(0, 0, 0, .35)';
    lazyLoad: boolean = true;
    hideOnNoSlides: boolean = false;
    width: string = '100%';
    loaded_items: boolean = false;
    data_loaded: boolean = false;
    complex_loaded: boolean = false;

    private _unsubscribeAll: Subject<any>;
    private currentUser: currentUser;
    private max_queue_size: number = 0;
    private current_queue_size: number = 0;


    name = 'Angular';
    slideNo = 0;
    withAnim = true;
    resetAnim = true;

    @ViewChild('myCarousel') myCarousel: NguCarousel<any>;
    carouselConfig: NguCarouselConfig = {
        grid: {xs: 1, sm: 1, md: 5, lg: 5, all: 0},
        load: 1,
        interval: {timing: 4000, initialDelay: 1000},
        loop: true,
        touch: true,
        velocity: 0.2
    }
    carouselItems = [];
    property = [];

    constructor(
        private route: ActivatedRoute,
        private _httpClient: HttpClient,
        private _fuseConfigService: FuseConfigService,
        @Inject(DOCUMENT) private document: any,
        private modelSerivce: ModelService,
        @Inject(APP_CONFIG) private config: AppConfig,
        //private winRef: WindowRef,
        private _cdr: ChangeDetectorRef
    ) {
        //console.log(this.property);

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.api_url = this.modelSerivce.get_api_url();

        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                }
            }
        };

        this.model_name = this.route.snapshot.paramMap.get('model_name');
        this.control_name = this.route.snapshot.paramMap.get('control_name');
        this.key_value = this.route.snapshot.paramMap.get('id');
        //console.log(this.document);
        //console.log(window);

        //console.log(this.winRef);
        //console.log(window.parent);
        //console.log(window.parent.document);
        //console.log(window.parent.document.getElementById('parent_bru'));


        this.controlPressed = false;
        this.controlProcessing = true;
    }


    ngOnInit() {
        this.load_grid_data('complex', {active: 1}, ['complex_id', 'name', 'url', 'image']);
        this.load_grid_data('data', {active: 1, user_id: 226}, ['id', 'city_id', 'country_id', 'street_id', 'number', 'price', 'currency_id', 'image']);
        this.load_grid_data('data', {active: 1, user_id: 228}, ['id', 'city_id', 'country_id', 'street_id', 'number', 'price', 'currency_id', 'image']);
        this.load_grid_data('data', {topic_id: 6195}, ['id', 'city_id', 'country_id', 'street_id', 'number', 'price', 'currency_id', 'image']);
        this.load_grid_data('data', {topic_id: 6222}, ['id', 'city_id', 'country_id', 'street_id', 'number', 'price', 'currency_id', 'image']);
        this.max_queue_size = 5;
    }
    ngAfterViewInit() {
        this._cdr.detectChanges();
    }

    goto(href) {
        window.parent.location = href;
    }

    reset() {
        this.myCarousel.reset(!this.resetAnim);
    }

    moveTo(slide) {
        this.myCarousel.moveTo(slide, !this.withAnim);
    }

    after_load_items() {
        if (this.current_queue_size == this.max_queue_size) {
            this.loaded_items = true;
            //console.log(this.property);
            this._cdr.detectChanges();
        }
    }

    load_grid_data(app_name, params: any, grid_item) {
        //console.log(this.currentUser.session_key);
        const body = {action: 'model', anonymous: true, do: 'get_data', model_name: app_name, params: params, session_key: this.currentUser.session_key, grid_item: grid_item};
        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .subscribe((result: any) => {
                //console.log(result);
                this.init_data_slides(app_name, result.rows);
            });
    }

    init_data_slides(app_name, rows) {
        var image_items;
        var key_item;
        var value_items;
        var value_zero;
        var normal;
        var caption;
        var href;
        var caption_array = [];
        var old_style = false;

        for (let key in rows) {
            try {
                key_item = rows[key];
                image_items = key_item['image'];
                //console.log(key_item);
                //console.log(image_items);
                if (image_items == '') {
                    continue;
                }
                if (typeof image_items[0] === 'undefined') {
                    value_items = image_items['value'];
                    //console.log(rows[key]);
                    value_zero = value_items[0];
                } else {
                    old_style = true;
                    value_zero = image_items[0];
                }
                normal = value_zero['normal'];


                if (typeof normal === 'undefined') {
                    console.log('undefined');
                } else {
                    let img_url = `${this.api_url}/img/data/` + normal;
                    if (app_name == 'complex') {
                        if (!old_style) {
                            caption = rows[key]['name']['value'];
                            href = '/complex/' + rows[key]['url']['value'] + '/';
                        } else {
                            caption = rows[key]['name'];
                            href = '/complex/' + rows[key]['url'] + '/';
                        }
                    } else {
                        caption_array = [];
                        if (rows[key]['country_id']['value_string'] !== null && rows[key]['country_id']['value_string'] != '') {
                            caption_array.push(rows[key]['country_id']['value_string']);
                        }

                        if (rows[key]['city_id']['value_string'] !== null && rows[key]['city_id']['value_string'] != '') {
                            caption_array.push(rows[key]['city_id']['value_string']);
                        }

                        if (rows[key]['street_id']['value_string'] !== null && rows[key]['street_id']['value_string'] != '') {
                            caption_array.push(rows[key]['street_id']['value_string']);
                        }
                        if (old_style) {
                            caption_array.push(rows[key]['price'] + ' ' + rows[key]['currency_id']['value_string']);
                            href = '/realty' + rows[key]['id'];
                        } else {
                            caption_array.push(rows[key]['price']['value'] + ' ' + rows[key]['currency_id']['value_string']);
                            href = '/realty' + rows[key]['id']['value'];
                        }


                        caption = caption_array.join(", ");
                    }
                    let slide_item = {img_url: img_url, caption: caption, href: href};
                    this.property.push(slide_item);
                    //this.property[key]['href'] = href;
                    this.carouselItems.push(1);
                }

            } catch (e) {
                console.log(e);
            }
        }
        this.current_queue_size++;
        //console.log(this.current_queue_size);

        this.after_load_items();
    }
}
