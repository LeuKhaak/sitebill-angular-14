import {ChangeDetectionStrategy, Component} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'region-grid',
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class RegionComponent extends GridComponent {
    setup_apps() {
        this.entity.set_app_name('region');
        this.entity.set_table_name('region');
        this.entity.primary_key = 'region_id';
    }
}
