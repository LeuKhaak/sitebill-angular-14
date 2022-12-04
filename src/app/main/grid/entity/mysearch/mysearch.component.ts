import {Component} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'mysearch-grid',
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class MysearchComponent extends GridComponent {
    setup_apps() {
        this.entity.set_app_name('mysearch');
        this.entity.set_table_name('mysearch');
        this.entity.primary_key = 'mysearch_id';
        this.entity.set_default_params({ user_id: this.modelService.get_user_id() });
        this.disable_add_button = true;
        this.disable_edit_button = true;
        this.disable_view_button = true;


        let grid_fields = ['mysearch_id', 'name', 'parameters'];
        this.define_grid_fields(grid_fields);

    }
}
