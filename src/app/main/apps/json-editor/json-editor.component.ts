import {Component, EventEmitter, Input, Output} from '@angular/core';

import { ModelService } from 'app/_services/model.service';
import {Subject, Subscription} from "rxjs";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {JsonParams} from "../../../_models";
import {takeUntil} from "rxjs/operators";
import {forbiddenNullValue} from "../../grid/form/form-constructor.component";

interface Preset {
    name: string;
    title: string;
    pairs: JsonParams
}

@Component({
    selector   : 'json-editor',
    templateUrl: './json-editor.component.html',
    styleUrls  : ['./json-editor.component.scss']
})
export class JsonEditorComponent
{
    protected _unsubscribeAll: Subject<any>;
    form: FormGroup;

    @Input()
    json: JsonParams;

    @Output() onChange = new EventEmitter();


    form_length: number = 0;
    form_subscription: Subscription;
    presets: Preset[];

    constructor(
        protected modelService: ModelService,
        protected _formBuilder: FormBuilder,
    ) {
        this.form = this._formBuilder.group({});
        this._unsubscribeAll = new Subject();
/*
        this.json = {
            allow_htmltags: "a",
            depended: "d",
            linked: "l",
            map_height: "300",
            map_width: "350",
            sdfsdfsdf: "s",
        }
*/
        this.presets = [
            {
                name: 'uploads_full',
                title: 'Полный набор для uploads',
                pairs: {
                    norm_width: '1920',
                    norm_height: '1080',
                    prev_width: '270',
                    prev_height: '270',
                    preview_smart_resizing: '1',
                }
            },
            {
                name: 'dt_format',
                title: 'Формат даты',
                pairs: {
                    format: 'eu',
                    inFormFormat: 'eu',
                    noSeconds: '1',
                }
            },
            {
                name: 'onchange',
                title: 'Событие при изменении значения',
                pairs: {
                    onchange: 'function_name',
                }
            },
            {
                name: 'styles',
                title: 'CSS-стили',
                pairs: {
                    styles: '',
                }
            },
            {
                name: 'mask',
                title: 'Маска ввода номеров телефона',
                pairs: {
                    mask: 'h (hhh) hhh-hh-hh',
                }
            },
            {
                name: 'allow_html',
                title: 'Разрешить HTML-коды',
                pairs: {
                    allow_htmltags: '1',
                }
            },
            {
                name: 'link_dep',
                title: 'Связанные справочники',
                pairs: {
                    linked: 'linked_key_id',
                    depended: 'depended_key_id',
                }
            },
            {
                name: 'autocomplete',
                title: 'Автозаполнение',
                pairs: {
                    autocomplete: '1',
                    autocomplete_notappend: '0',
                }
            },
            {
                name: 'geodata_map_size',
                title: 'Размер карты',
                pairs: {
                    map_width: '300',
                    map_height: '300',
                }
            },
            {
                name: 'ta_cr',
                title: 'Параметры поля ввода текста',
                pairs: {
                    cols: '30',
                    rows: '7',
                }
            },
            {
                name: 'rules',
                title: 'Произвольное правило rules',
                pairs: {
                    rules: '',
                }
            },
        ];
    }

    ngOnInit(): void {
        if ( this.json ) {
            this.drawForm(this.json);
        }

    }

    subscribeForm () {
        this.form_subscription = this.form.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((status) => {
                this.onChange.emit(this.recreateJson(status));
            });
    }

    unsubscribeForm () {
        if ( this.form_subscription ) {
            this.form_subscription.unsubscribe();
        }
    }

    drawForm ( json: JsonParams ) {
        let i = 0;
        this.form_length = 0;
        this.unsubscribeForm();
        this.form = this._formBuilder.group({});
        for (const [key_obj, value_obj] of Object.entries(json)) {
            let form_control_item = new FormControl(key_obj);
            form_control_item.setValidators(forbiddenNullValue());
            this.form.addControl(this.getKeyName(i), form_control_item);

            form_control_item = new FormControl(value_obj);
            form_control_item.setValidators(forbiddenNullValue());
            this.form.addControl(this.getValueName(i), form_control_item);
            i++;
        }
        this.form_length = i;
        this.subscribeForm();
        this.onChange.emit(json);
    }

    recreateJson ( newKeyValue: {} ):JsonParams {
        let new_json:JsonParams = {};
        for ( let i = 0; i < this.form_length; i++ ) {
            new_json[newKeyValue[this.getKeyName(i)]] = newKeyValue[this.getValueName(i)];
        }
        return new_json;
    }

    getCurrentJson() {
        let json:JsonParams = {};
        for ( let i = 0; i < this.form_length; i++ ) {
            json[this.form.controls[this.getKeyName(i)].value] = this.form.controls[this.getValueName(i)].value;
        }
        return json;
    }

    deleteEntry(key: string) {
        let current_json = this.getCurrentJson();
        delete(current_json[this.form.controls[key].value]);
        this.json = current_json;
        this.drawForm(current_json);
        return current_json;
    }


    getKeyName( index: number ) {
        return 'key-' + index.toString();
    }
    getValueName( index: number ) {
        return 'value-' + index.toString();
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

    addEntry() {
        let current_json = this.getCurrentJson();
        let new_key = 'key' + this.form_length++;
        while (current_json[new_key] !== undefined) {
            new_key = 'key' + this.form_length++;
        }
        current_json[new_key] = '';
        this.json = current_json;
        this.drawForm(current_json);
        this.onChange.emit(current_json);
    }

    injectPreset(preset: Preset) {
        let current_json = this.getCurrentJson();
        for (const [key_obj, value_obj] of Object.entries(preset.pairs)) {
            if ( current_json[key_obj] === undefined ) {
                current_json[key_obj] = value_obj;
            }
        }
        this.json = current_json;
        this.drawForm(current_json);
    }
}
