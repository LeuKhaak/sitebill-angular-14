import {Component, Input} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'building-blocks-grid',
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    animations: fuseAnimations
})
export class BuildingBlocksComponent extends GridComponent {
    @Input('object_id')
    object_id: number;

    @Input('object_type')
    object_type: string;

    setup_apps() {
        this.entity.set_app_name('building_blocks');
        this.entity.set_table_name('building_blocks');
        this.entity.set_primary_key('id');
        this.entity.set_hidden('id');
        this.entity.set_hidden('object_id');
        this.entity.set_hidden('object_type');
        const default_columns_list = [
            'title',
            'plan',
        ];
        this.define_grid_fields(default_columns_list);

        this.entity.set_default_value('object_id', this.object_id);
        this.entity.set_default_value('object_type', this.object_type);

        this.entity.set_default_params({
            object_id: this.object_id,
            object_type: this.object_type
        });

        console.log(this.entity);


    }
}
