import {EventEmitter, Injectable, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {GetApiUrlService} from './get-api-url.service';
import {GetSessionKeyService} from './get-session-key.service';

@Injectable()
export class ImageService {

    @Output() OnShare: EventEmitter<any> = new EventEmitter();

    constructor(
        private http: HttpClient,
        protected getApiUrlService: GetApiUrlService,
        protected getSessionKeyService: GetSessionKeyService,
    ) {}

    imageGalleryShare(value): any {
        this.OnShare.emit(value);
    }

    deleteImage(model_name, key_name, key_value, image_id, field_name) {
        const body = {
            layer: 'native_ajax',
            action: 'dz_imagework',
            what: 'delete',
            model_name: model_name,
            key: key_name,
            key_value: key_value,
            current_position: image_id,
            field_name: field_name,
            session_key: this.getSessionKeyService.get_session_key_safe(),
        };
        this.imageGalleryShare('deleted');
        return this.http.post(
            `${this.getApiUrlService.get_api_url()}/apps/api/rest.php`,
            body
        );
    }

    deleteAllImages(model_name, key_name, key_value, field_name) {
        const body = {
            layer: 'native_ajax',
            action: 'dz_imagework',
            what: 'delete_all',
            model_name: model_name,
            key: key_name,
            key_value: key_value,
            field_name: field_name,
            session_key: this.getSessionKeyService.get_session_key_safe(),
        };
        return this.http.post(
            `${this.getApiUrlService.get_api_url()}/apps/api/rest.php`,
            body
        );
    }

    reorderImage(
        model_name,
        key_name,
        key_value,
        image_id,
        direction,
        field_name
    ) {
        let body = {};
        if (direction === 'make_main') {
            body = {
                layer: 'native_ajax',
                action: 'dz_imagework',
                what: 'make_main',
                model_name: model_name,
                key: key_name,
                key_value: key_value,
                current_position: image_id,
                field_name: field_name,
                session_key: this.getSessionKeyService.get_session_key_safe(),
            };
        } else {
            body = {
                layer: 'native_ajax',
                action: 'dz_imagework',
                what: 'reorder',
                reorder: direction,
                model_name: model_name,
                key: key_name,
                key_value: key_value,
                current_position: image_id,
                field_name: field_name,
                session_key: this.getSessionKeyService.get_session_key_safe(),
            };
        }
        return this.http.post(
            `${this.getApiUrlService.get_api_url()}/apps/api/rest.php`,
            body
        );
    }

    rotateImage(
        model_name,
        key_name,
        key_value,
        image_id,
        rot_dir,
        field_name
    ) {
        let body = {};
        body = {
            layer: 'native_ajax',
            action: 'dz_imagework',
            what: 'rotate',
            rot_dir: rot_dir,
            model_name: model_name,
            key: key_name,
            key_value: key_value,
            current_position: image_id,
            field_name: field_name,
            session_key: this.getSessionKeyService.get_session_key_safe(),
        };
        return this.http.post(
            `${this.getApiUrlService.get_api_url()}/apps/api/rest.php`,
            body
        );
    }
}
