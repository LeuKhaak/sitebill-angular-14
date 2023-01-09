import {Component} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'myсlient-grid', // 'myclient-grid'
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class MyGridClientComponent extends GridComponent {
    setup_apps(): void {
        this.entity.set_app_name('mygridclient');
        this.entity.set_table_name('client');
        this.entity.primary_key = 'client_id';
        this.entity.set_default_params({ user_id: this.getSessionKeyService.get_user_id() });
        // this.disable_add_button = true;


        // let grid_fields = ['mysearch_id', 'name', 'parameters'];
        // this.define_grid_fields(grid_fields);

    }
}
