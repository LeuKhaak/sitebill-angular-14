import {Component, Input} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'cloud-testimonials-grid',
    templateUrl: '../../../grid.component.html',
    styleUrls: ['../../../grid.component.scss'],
    animations: fuseAnimations
})
export class CloudTestimonialsComponent extends GridComponent {
    @Input('object_id')
    object_id: string;

    @Input('object_type')
    object_type: string;

    @Input('api_key')
    api_key: string;

    setup_apps() {
        this.entity.set_app_name('review');
        this.entity.set_table_name('review');
        this.entity.primary_key = 'review_id';

        this.entity.set_default_value('object_id', this.object_id);
        this.entity.set_default_value('object_type', this.object_type);

        if ( this.api_key ) {
            this.entity.set_app_url('https://api.sitebill.ru');
            this.entity.set_app_session_key('nobody');
            this.entity.set_default_value('api_key', this.api_key);
        }

        this.entity.set_default_params({
            object_id: this.object_id,
            object_type: this.object_type
        });
    }

    getRowClass(row): string {
        try {
            if (row.active.value != 1) {
                return 'red-100-bg';
            }
        } catch {
        }


    }
}
