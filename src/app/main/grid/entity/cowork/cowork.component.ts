import {Component, Input} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'cowork-grid',
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    animations: fuseAnimations
})
export class CoworkComponent extends GridComponent {
    @Input('cowork_object_id')
    cowork_object_id: number;

    @Input('cowork_object_type')
    cowork_object_type: string;

    setup_apps() {
        this.entity.set_app_name('cowork');
        this.entity.set_table_name('cowork');
        this.entity.set_primary_key('cowork_id');
        this.entity.set_hidden('cowork_id');
        const default_columns_list = [
            'coworker_id'
        ];
        this.define_grid_fields(default_columns_list);

        this.entity.set_default_value('id', this.cowork_object_id);
        this.entity.set_default_value('object_type', this.cowork_object_type);

        this.entity.set_default_params({
                id: this.cowork_object_id,
                object_type: this.cowork_object_type
            });


    }
}
